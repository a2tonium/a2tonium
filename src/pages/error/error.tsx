import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
    first: string;
    second: string;
    third: string;
}

export function ErrorPage({ first, second, third }: ErrorPageProps) {
    return (
        <div className="min-h-[710px] flex flex-col justify-center items-center bg-white text-center rounded-[2vw] md:border-[6px] border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start items-center md:space-x-10">
                <div className="">
                    <img
                        src="/images/toncoin.png"
                        alt="Wallet Not Found"
                        className="w-[200px] md:w-[250px] md:w-[300px] md:my-10"
                    />
                </div>
                <div className="flex flex-col md:items-start m-0 items-center md:pt-16">
                    <h1 className="text-[30px] md:text-[40px] lg:text-[60px] font-bold text-black-900">
                        {first}
                    </h1>
                    <p className="text-lg md:text-xl text-black-900 mb-2 font-semibold">
                        {second}
                    </p>
                    <p className="text-sm md:text-[14px] text-gray-400 mb-6 px-2 md:p-0">
                        {third}
                    </p>

                    <Link to="/">
                        <Button className="bg-goluboy hover:bg-blue-600 text-white px-6 py-2 rounded-2xl font-semibold">
                            Go Back Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
