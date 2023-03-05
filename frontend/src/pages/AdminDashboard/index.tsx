import { AdminSideBar, HomeStats, StatsGrid } from "../../components";
import { Flex, Box } from "@mantine/core";
import { useEffect, useState } from "react";
import UserAPI from "../../api/UserAPI";
import AdminAPI from "../../api/AdminAPI";

interface StatData {
  title: string;
  icon: "user" | "password" | "breach" | "coin";
  value: string;
  diff: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatData[]>([
    {
      title: "New users",
      icon: "user",
      value: "0",
      diff: 0,
    },
    {
      title: "New Breaches",
      icon: "breach",
      value: "0",
      diff: 0,
    },
    {
      title: "New Vaults",
      icon: "password",
      value: "0",
      diff: 0,
    },
    {
      title: "Leaked Data",
      icon: "coin",
      value: "0",
      diff: 0,
    },
  ]);
  const [homeStats, setHomeStats] = useState({
    breaches: 0,
    accounts: 0,
    emails: 0,
    passwords: 0,
    usernames: 0,
    phoneNumbers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await AdminAPI.getAdminDashboardStats();
      const data = response.data;
      const stats = [
        {
          title: "New users",
          icon: "user" as const,
          value: data.users.thisMonth.toString(),
          diff:
            data.users.lastMonth === 0
              ? 100 * data.users.thisMonth
              : ((data.users.thisMonth - data.users.lastMonth) /
                  data.users.lastMonth) *
                100,
        },
        {
          title: "New Breaches",
          icon: "breach" as const,
          value: data.breaches.thisMonth.toString(),
          diff:
            data.breaches.lastMonth === 0
              ? 100 * data.breaches.thisMonth
              : ((data.breaches.thisMonth - data.breaches.lastMonth) /
                  data.breaches.lastMonth) *
                100,
        },
        {
          title: "New Vaults",
          icon: "password" as const,
          value: data.vaults.thisMonth.toString(),
          diff:
            data.vaults.lastMonth === 0
              ? 100 * data.vaults.thisMonth
              : ((data.vaults.thisMonth - data.vaults.lastMonth) /
                  data.vaults.lastMonth) *
                100,
        },
        {
          title: "Leaked Data",
          icon: "coin" as const,
          value: data.leakedData.thisMonth.toString(),
          diff:
            data.leakedData.lastMonth === 0
              ? 100 * data.leakedData.thisMonth
              : ((data.leakedData.thisMonth - data.leakedData.lastMonth) /
                  data.leakedData.lastMonth) *
                100,
        },
      ];

      setStats(stats);

      const response2 = await UserAPI.getHomeStats();
      const data2 = response2.data;
      setHomeStats({
        breaches: data2.breaches,
        accounts: data2.accounts,
        emails: data2.emails,
        passwords: data2.passwords,
        usernames: data2.usernames,
        phoneNumbers: data2.phoneNumbers,
      });
    };
    fetchData();
  }, []);
  return (
    <Flex
      gap="xs"
      justify="space-between"
      align="flex-start"
      direction="row"
      wrap="wrap"
      style={{ height: "100vh" }}
    >
      <AdminSideBar />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "79vw",
          height: "100vh",
        }}
      >
        <StatsGrid data={stats} />
        <HomeStats
          data={[
            {
              label: "Toatal Breaches",
              stats: homeStats.breaches
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: "breach",
            },
            {
              label: "Total accounts",
              stats: homeStats.accounts
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: "user",
            },
            {
              label: "pwned emails",
              stats: homeStats.emails
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: "email",
            },
            {
              label: "pwned passwords",
              stats: homeStats.passwords
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              icon: "password",
            },
          ]}
          width="75vw"
        />
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
