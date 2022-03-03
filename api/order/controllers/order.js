'use strict';

const { sanitizeEntity } = require('strapi-utils/lib');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  createPaymentIntent: async (ctx) => {
    const { cart } = ctx.request.body;

    //simplificando os dados do carrinho
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // pega todos os jogos
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    if(!games.length) {
      ctx.response.status = 404;
      return {
        error: "No valid games found!"
      };
    }

    const total = await strapi.config.functions.cart.total(games);

    if(total === 0) {
      return {
        freeGames: true
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        automatic_payment_methods: {enabled: true},
        metadata: { cart: JSON.stringify(cartGamesIds) }
      });

      return paymentIntent;
    } catch (error) {
      return {
        error: error.raw.message
      }
    }
  },

  create: async(ctx) => {
    //pegar informações do front
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body;

    // pega informações do usuario
    // pega o token do usuário
    const token = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);
    //pega informações do usuario através do ID dele vindo pelo token
    const userInfo = await strapi
      .query("user", "users-permissions")
      .findOne({id: token.id});

    //simplificando os dados do carrinho
    const cartGamesIds = await strapi.config.functions.cart.cartGamesIds(cart);

    // pega todos os jogos
    const games = await strapi.config.functions.cart.cartItems(cartGamesIds);

    // pegar o total dos jogos (saber se é free ou não)
    const total_in_cents = await strapi.config.functions.cart.total(games);

    //salvar no banco de dados
    //pegar do frontend os valores do paymentMethos
    const entry = {
      total_in_cents,
      payment_intent_id: paymentIntentId,
      cart_brand: null,
      cart_last4: null,
      games,
      user: userInfo
    };

    const entity = await strapi.services.order.create(entry);

    //enviar e-mail para o usuario

    //retorna que foi salvo no banco
    return sanitizeEntity(entity, { model: strapi.models.order });

  }
};
