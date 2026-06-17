(function initRenteriaFlowSupabase(global) {
  const runtimeConfig = global.RENTERIA_FLOW_SUPABASE_CONFIG || {};

  function getRenteriaFlowSupabaseConfig() {
    return {
      url: runtimeConfig.SUPABASE_URL || "",
      publishableKey: runtimeConfig.SUPABASE_PUBLISHABLE_KEY || "",
    };
  }

  function createRenteriaFlowSupabaseClient(supabaseFactory) {
    const { url, publishableKey } = getRenteriaFlowSupabaseConfig();
    const factory = supabaseFactory || global.supabase;

    if (!url || !publishableKey || !factory) {
      return null;
    }

    return factory.createClient(url, publishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  global.RenteriaFlowSupabase = {
    getConfig: getRenteriaFlowSupabaseConfig,
    createClient: createRenteriaFlowSupabaseClient,
  };
})(window);
