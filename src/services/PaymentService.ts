import { initSupabase } from '../lib/supabase';

export type PlanType = 'starter' | 'pro' | 'tiktok';

interface PaymentConfig {
  plans: {
    [key in PlanType]: {
      offerId: string;
      price: number;
      productId: number;
    };
  };
}

const config: PaymentConfig = {
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
      'authorized': 'active',
      'trial': 'trial',
      'refunded': 'cancelled',
      'chargeback': 'cancelled',
      'subscription_canceled': 'cancelled',
      'subscription_delayed': 'delayed',
      'all_charges_paid': 'completed'
    };

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

    // Registrar histórico de pagamento
    await supabase
      .from('payment_history')
      .insert({
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
}