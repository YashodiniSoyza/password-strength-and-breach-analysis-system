import breach from "../models/Breach.model";
import leakedData from "../models/LeakedData.model";
import vault from "../models/Vault.model";
import user from "../models/User.model";

export const getHomeStats = async () => {
  let breaches = 0;
  let accounts = 0;
  let emails = 0;
  let passwords = 0;
  let usernames = 0;
  let phoneNumbers = 0;

  // get breaches
  const breachesData = await breach.find();
  breaches = breachesData.length;

  // get accounts
  breachesData.forEach((breach) => {
    accounts += breach.compromisedAccounts;
  });

  // get emails
  const emailsData = await leakedData.find({ email: { $ne: "" } });
  emails = emailsData.length;

  // get passwords
  const passwordsData = await leakedData.find({ password: { $ne: "" } });
  passwords = passwordsData.length;

  // get usernames
  const usernamesData = await leakedData.find({ username: { $ne: "" } });
  usernames = usernamesData.length;

  // get phoneNumbers
  const phoneNumbersData = await leakedData.find({ phone: { $ne: "" } });
  phoneNumbers = phoneNumbersData.length;

  const responseObj = {
    breaches,
    accounts,
    emails,
    passwords,
    usernames,
    phoneNumbers,
  };

  return responseObj;
};

//get admin stats
//number of users registered in this month and last month
//number of breaches added in this month and last month
//number of vaults created in this month and last month
//number of leaked data added in this month and last month
export const adminDashboardStats = async () => {
  const responseObj = {
    users: {
      thisMonth: 0,
      lastMonth: 0,
    },
    breaches: {
      thisMonth: 0,
      lastMonth: 0,
    },
    vaults: {
      thisMonth: 0,
      lastMonth: 0,
    },
    leakedData: {
      thisMonth: 0,
      lastMonth: 0,
    },
  };

  const thisMonth = new Date();
  const lastMonth = new Date();
  thisMonth.setMonth(thisMonth.getMonth() - 1);
  lastMonth.setMonth(lastMonth.getMonth() - 2);

  //get users
  const users = await user.find();
  users.forEach((user) => {
    const userDate = new Date(user.createdAt);
    if (userDate >= thisMonth) {
      responseObj.users.thisMonth++;
    } else if (userDate >= lastMonth) {
      responseObj.users.lastMonth++;
    }
  });

  //get breaches
  const breaches = await breach.find();
  breaches.forEach((breach) => {
    const breachDate = new Date(breach.createdAt);
    if (breachDate >= thisMonth) {
      responseObj.breaches.thisMonth++;
    } else if (breachDate >= lastMonth) {
      responseObj.breaches.lastMonth++;
    }
  });

  //get vaults
  const vaults = await vault.find();
  vaults.forEach((vault) => {
    const vaultDate = new Date(vault.createdAt);
    if (vaultDate >= thisMonth) {
      responseObj.vaults.thisMonth++;
    } else if (vaultDate >= lastMonth) {
      responseObj.vaults.lastMonth++;
    }
  });

  //get leaked data
  const leaks = await leakedData.find();
  leaks.forEach((leak) => {
    const leakedDataDate = new Date(leak.createdAt);
    if (leakedDataDate >= thisMonth) {
      responseObj.leakedData.thisMonth++;
    } else if (leakedDataDate >= lastMonth) {
      responseObj.leakedData.lastMonth++;
    }
  });

  return responseObj;
};

module.exports = {
  getHomeStats,
  adminDashboardStats,
};
