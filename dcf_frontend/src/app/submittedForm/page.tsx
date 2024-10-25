import { useEffect, useState } from "react";
import { SubmittedForm, columns } from './columns';
import { DataTable } from "@/components/ui/data-table";

async function getData(): Promise<SubmittedForm[]> {
    return [
        {
            id: "1",
            name: 'Naboni',
            email: "Naboni@gmail.com",
            question_1: "m@example.com",
            question_2: "m@example.com",
            question_3: "m@example.com",
            question_4: "m@example.com",
            question_5: "m@example.com",
            question_6: "m@example.com",
            question_7: "m@example.com",
            question_8: "m@example.com",
            question_9: "m@example.com",
            question_10: "m@example.com",
            question_11: "m@example.com",
        }
    ];
}

export default function SubmittedFormPage() {
    const [data, setData] = useState<SubmittedForm[]>([]);
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
            <DataTable columns={columns} data={data} filterColumnKey="name" />
        </div>
    );
}
