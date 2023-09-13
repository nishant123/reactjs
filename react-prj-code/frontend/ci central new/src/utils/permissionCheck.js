const permissionCheck = (entity, action) => {
  let access = true;
  let permission = JSON.parse(localStorage.getItem("userRecord"));
  // case is for user not signed in
  if (!permission) {
    return true;
  }
  switch (entity) {
    case "/deliveries":
      if (!permission.DeliveryDashboardAccess) access = false;
      break;
    case "/requests":
      if (!permission.RequestsBoardAccess) access = false;
      break;
    case "/finance":
      if (!permission.FinanceAccess) access = false;
      break;
    case "/marketsettings":
      if (!permission.ManageMarketAccess) access = false;
      break;
    case "/users":
      if (!permission.ManageUsersAccess) access = false;
      break;
    case "/":
      if (!permission.InternalDashBoardAccess) access = false;
      break;
    default:
      break;
  }
  return access;
};
export default permissionCheck;
