/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { patient } from "./columns";
import { DataTableClientWrapper } from "./DataTableClientWrapper";

async function getData(): Promise<patient[]> {
  // Fetch data from your API here.
  try {
    const response = await axios.get("http://localhost:4000/credential", {
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = response.data
    return data.filter((item: any) => item.roleType !== "Manager")
  } catch (error: unknown) {
    let errorMessage = "An unknown error happened"
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message
    }else if (error instanceof Error) {
      errorMessage = error.message
    }
    console.log(errorMessage)
    return []
  }
}

export default async function UpdateCredential() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-5 h-screen justify-center items-center">
      <div className="container mx-auto">
        <DataTableClientWrapper data={data ?? []}/>
      </div>
    </div>
  );
}
