export const idlFactory = ({ IDL }) => {
  const Merchant = IDL.Record({
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
  const Main = IDL.Service({
    'get' : IDL.Func([], [Response], ['query']),
    'update' : IDL.Func([Merchant], [Response], []),
  });
  return Main;
};
export const init = ({ IDL }) => { return []; };
