import AdminContent from "@/components/AdminContent";
import { getUserByName } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

interface AdminPageProps {
  params: Promise<{
    roleKey: string;
  }>;
}

export default async function Admin({ params }: AdminPageProps) {
  const { roleKey } = await params;
  const t = await getTranslations("Admin");

  if (!roleKey) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("Routing Error")}
          </h1>
          <p className="text-gray-600">
            {t("Role key parameter is missing from URL")}
          </p>
        </div>
      </div>
    );
  }
  const result = await getUserByName(roleKey);

  if (!result.success || !result.user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("User not found")}
          </h1>
          <p className="text-gray-600">
            {t("User data for")}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {roleKey}
            </span>{" "}
            {t("couldn&apos;t be found")}
          </p>
        </div>
      </div>
    );
  }

  const user = result.user;
  if (user.roleType !== "Admin" && user.roleType !== "Manager") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white shadow-xl rounded-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("Access Denied")}
          </h1>
          <p className="text-gray-600">
            {t("User role")}
            <span className="font-mono bg-gray-100 p-1 rounded-md text-sm">
              {user.roleType}
            </span>{" "}
            {t("does not have admin access")}
          </p>
        </div>
      </div>
    );
  }

  return <AdminContent user={user} />;
}
