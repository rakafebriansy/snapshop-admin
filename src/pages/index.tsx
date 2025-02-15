import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hello, {session?.user?.name}</h2>
        <div className="flex bg-gray-300 items-center overflow-hidden text-black rounded-lg">
          <Image
            src={session?.user?.image ?? ''}
            width={40}
            height={40} 
            className="w-8 h-8"
            alt={session?.user?.name ?? 'image'} />
            <span className="text-xs px-2">{session?.user?.name ?? '-'}</span>
        </div>
      </div>
    </Layout>
  );
}
