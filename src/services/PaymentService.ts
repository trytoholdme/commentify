import { initSupabase } from '../lib/supabase';

export type PlanType = 'starter' | 'pro' | 'tiktok';

interface PaymentConfig {
  clientId: string;
  clientSecret: string;
  plans: {
    [key in PlanType]: {
      offerId: string;
      price: number;
      productId: number;
    };
  };
}

const config: PaymentConfig = {
  clientId: import.meta.env.VITE_TICTO_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_TICTO_CLIENT_SECRET || '',
  plans: {
    starter: {
      offerId: 'OA0B7FCAE',
      productId: 78800,
      price: 9700 // R$ 97,00
    },
    pro: {
      offerId: 'O0E56DC72',
      productId: 78800,
      price: 19700 // R$ 197,00
    },
    tiktok: {
      offerId: 'O640EBC81',
      productId: 78800,
      price: 14700 // R$ 147,00
    }
  }
};

export async function createCheckoutSession(planType: PlanType) {
  try {
    const supabase = await initSupabase();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    const plan = config.plans[planType];
    if (!plan) {
      throw new Error('Plano inválido');
    }

    // Obter dados do perfil do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('user_id', session.user.id)
      .single();

    // Criar payload para a Ticto
    const payload = {
      offer_code: plan.offerId,
      customer: {
        name: profile?.name || session.user.email?.split('@')[0] || 'Cliente',
        email: session.user.email,
        phone: {
          number: '', // Opcional
          ddd: '',   // Opcional
          ddi: ''    // Opcional
        }
      },
      success_url: `${window.location.origin}/dashboard?payment=success`,
      cancel_url: `${window.location.origin}/dashboard?payment=cancel`,
      external_code: session.user.id // Para rastrear o usuário
    };

    // TODO: Implementar chamada à API da Ticto
    console.log('Payload para Ticto:', payload);
    throw new Error('Aguardando endpoint da API da Ticto');
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function handleWebhook(request: Request) {
  try {
    const supabase = await initSupabase();
    const payload = await request.json();
    
    // Validar versão do webhook
    if (payload.version !== '2.0') {
      throw new Error('Versão do webhook não suportada');
    }

    // Extrair dados relevantes
    const {
      status,
      token,
      order,
      customer,
      item,
      subscriptions
    } = payload;

    // Validar token do webhook (você receberá este token da Ticto)
    // TODO: Implementar validação do token quando disponível

    // Mapear status da Ticto para nosso sistema
    const statusMap = {
      'authorized': 'active',
      'trial': 'trial',
      'refunded': 'cancelled',
      'chargeback': 'cancelled',
      'subscription_canceled': 'cancelled',
      'subscription_delayed': 'delayed',
      'all_charges_paid': 'completed'
    };

    // Determinar o tipo de plano baseado no offer_code
    let planType: PlanType | undefined;
    for (const [type, plan] of Object.entries(config.plans)) {
      if (plan.offerId === item.offer_code) {
        planType = type as PlanType;
        break;
      }
    }

    if (!planType) {
      throw new Error('Plano não identificado');
    }

    // Atualizar assinatura no banco
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: customer.code, // Usar external_code enviado no checkout
        plan_type: planType,
        status: statusMap[status as keyof typeof statusMap] || 'pending',
        trial_used: status === 'trial',
        starts_at: order.order_date,
        expires_at: subscriptions?.[0]?.next_charge || null,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    // Registrar histórico de pagamento
    await supabase
      .from('payment_history')
      .insert({
        user_id: customer.code,
        order_id: order.id,
        order_hash: order.hash,
        transaction_hash: order.transaction_hash,
        amount: order.paid_amount,
        status,
        payment_method: payload.payment_method,
        created_at: order.order_date
      });

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: 'Webhook error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Função auxiliar para validar webhook
function validateWebhookSignature(payload: any, signature: string): boolean {
  // TODO: Implementar validação da assinatura quando disponível na documentação
  return true;
}