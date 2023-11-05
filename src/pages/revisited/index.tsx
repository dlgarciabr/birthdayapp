import { useRouter } from "next/router";
import { Routes } from "@blitzjs/next";

const RevisitedPage = () => {
  const router = useRouter();
  void router.push(Routes.PeoplePage());
  return '';
};

export default RevisitedPage;
