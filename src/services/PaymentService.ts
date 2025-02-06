import { initSupabase } from '../lib/supabase';

export type PlanType = 'starter' | 'pro' | 'tiktok';

interface PaymentConfig {
<<<<<<< HEAD
  clientId: string;
  clientSecret: string;
=======
>>>>>>> 11807a8 (Atualização do projeto)
  plans: {
    [key in PlanType]: {
      offerId: string;
      price: number;
      productId: number;
    };
  };
}

const config: PaymentConfig = {
<<<<<<< HEAD
  clientId: import.meta.env.VITE_TICTO_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_TICTO_CLIENT_SECRET || '',
=======
>>>>>>> 11807a8 (Atualização do projeto)
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

<<<<<<< HEAD
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
=======
// Token de validação da Ticto
const TICTO_WEBHOOK_TOKEN = 'L3Bhct3DYwYAlEIAfYiNsD91k8Qj7bck4aTRmLS7dvuSxLqrGzP3keo7iw8hpsu6Qr4j90B7KGe37HgO5a3dz8xanIC0OpKxccuF';

// Função para validar o token do webhook
export function validateWebhookToken(token: string): boolean {
  return token === TICTO_WEBHOOK_TOKEN;
}

// Função para processar o webhook
export async function handleWebhook(payload: any) {
  try {
    const supabase = await initSupabase();

    // Extrair dados relevantes
    const {
      transaction,
      customer,
      producer,
      status
    } = payload;

    // Mapear status da Ticto para nosso sistema
    const statusMap: { [key: string]: string } = {
>>>>>>> 11807a8 (Atualização do projeto)
      'authorized': 'active',
      'trial': 'trial',
      'refunded': 'cancelled',
      'chargeback': 'cancelled',
      'subscription_canceled': 'cancelled',
      'subscription_delayed': 'delayed',
      'all_charges_paid': 'completed'
    };

<<<<<<< HEAD
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
=======
    // Determinar o tipo de plano baseado no valor
    let planType: PlanType;
    const amount = producer.amount / 100; // Converter centavos para reais

    if (amount === 197) planType = 'pro';
    else if (amount === 147) planType = 'tiktok';
    else planType = 'starter';

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', customer.email)
      .single();

    let userId = existingUser?.id;

    // Se o usuário não existir, criar novo
    if (!userId) {
      // Gerar senha aleatória temporária
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: customer.email,
        password: tempPassword,
        options: {
          data: {
            name: customer.name
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error('Erro ao criar usuário');

      userId = user.id;

      // Criar perfil
      await supabase
        .from('profiles')
        .insert([{
          user_id: userId,
          name: customer.name
        }]);
    }

    // Atualizar ou criar assinatura
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: statusMap[status] || 'pending',
        trial_used: status === 'trial',
        starts_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
      });

    if (subscriptionError) throw subscriptionError;
>>>>>>> 11807a8 (Atualização do projeto)

    // Registrar histórico de pagamento
    await supabase
      .from('payment_history')
      .insert({
<<<<<<< HEAD
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
=======
        user_id: userId,
        order_id: parseInt(transaction.hash.slice(-8), 16),
        order_hash: transaction.hash,
        transaction_hash: transaction.pix_qr_code,
        amount: producer.amount,
        status,
        payment_method: 'pix'
      });

    return {
      status: 200,
      body: { 
        received: true,
        message: 'Pagamento processado com sucesso'
      }
    };
  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    return {
      status: 500,
      body: { 
        error: 'Erro ao processar pagamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    };
  }
>>>>>>> 11807a8 (Atualização do projeto)
}