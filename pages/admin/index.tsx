import { NextPage } from "next"


const Admin: NextPage = ({}) => {

    return (
        <div className="grid my-3 place-content-center">
            <div className="text-5xl font-bold text-default">You are admin!</div>
            <hr />
            <div className="py-2 italic">More things to come...</div>
        </div>
    )
}

export default Admin