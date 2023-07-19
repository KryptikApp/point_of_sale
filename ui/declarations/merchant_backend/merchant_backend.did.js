export const idlFactory = ({ IDL }) => {
  const Merchant = IDL.Record({
    'id' : IDL.Text,
    'slug' : IDL.Text,
    'businessName' : IDL.Text,
    'phoneNumber' : IDL.Text,
    'phoneNotifications' : IDL.Bool,
  });
  const Response = IDL.Record({
    'status' : IDL.Nat16,
    'data' : IDL.Opt(Merchant),
    'status_text' : IDL.Text,
    'error_text' : IDL.Opt(IDL.Text),
  });
  const ResponseBool = IDL.Record({
    'status' : IDL.Nat16,
    'data' : IDL.Bool,
    'status_text' : IDL.Text,
    'error_text' : IDL.Opt(IDL.Text),
  });
  const ResponseMessage = IDL.Record({
    'status' : IDL.Nat16,
    'data' : IDL.Opt(IDL.Text),
    'status_text' : IDL.Text,
    'error_text' : IDL.Opt(IDL.Text),
  });
  const Main = IDL.Service({
    'get' : IDL.Func([], [Response], ['query']),
    'getMerchantBySlug' : IDL.Func([IDL.Text], [Response], []),
    'isSlugAvailable' : IDL.Func([IDL.Text], [ResponseBool], []),
    'sendSMS' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'txMessage' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [ResponseMessage],
        [],
      ),
    'update' : IDL.Func([Merchant], [Response], []),
    'welcomeMessage' : IDL.Func([IDL.Text, IDL.Text], [ResponseMessage], []),
  });
  return Main;
};
export const init = ({ IDL }) => { return [IDL.Text, IDL.Text]; };
