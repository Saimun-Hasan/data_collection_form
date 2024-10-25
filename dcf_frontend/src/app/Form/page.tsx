import { useEffect, useState } from "react";
import { Form, columns } from './columns';
import { DataTable } from "@/components/ui/data-table";

async function getData(): Promise<Form[]> {
    return [
        {
            id: "1",
            question: "m@example.com",
            type: 'Recording',
        }
    ];
}

export default function FormPage() {
    const [data, setData] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getData();
            setData(result);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} filterColumnKey="question" />
        </div>
    );
}
