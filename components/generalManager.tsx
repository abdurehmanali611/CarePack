/* eslint-disable @typescript-eslint/no-explicit-any */
import { HospitalIcon } from "lucide-react"
import Card from "./Card"

const GeneralManager = ({role}: any) => {
  return (
    <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
            <HospitalIcon />
            CarePack
        </div>
         {role.name}
        </div>
        <div className="flex flex-col gap-3">
           <p>Hi there 👋</p>
           <p>Take alook for Reports you have</p>
        </div>
        <Card />
    </div>
  )
}

export default GeneralManager