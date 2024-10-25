import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AudioRecorder } from 'react-audio-voice-recorder';

// UI Components
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useFormSubmissionMutation } from "@/slices/formApiSlice";
import { motion } from "framer-motion"

// --------------------------NLP Data Collection Form---------------------------- //

// Define the form schema
const formSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(3, 'Name Must be at least 3 letters long'),
    email: z.string({ required_error: 'Email is required' }).email("Enter a valid email"),
    question_1: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 1 is required',
    }),
    question_2: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 2 is required',
    }),
    question_3: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 3 is required',
    }),
    question_4: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 4 is required',
    }),
    question_5: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 5 is required',
    }),
    question_6: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 6 is required',
    }),
    question_7: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 7 is required',
    }),
    question_8: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 8 is required',
    }),
    question_9: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 9 is required',
    }),
    question_10: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 10 is required',
    }),
    question_11: z.instanceof(Blob).refine((blob) => blob.size > 0, {
        message: 'Audio for Question 11 is required',
    }),
});

interface FormSubmissionData {
    name: string;
    email: string;
    question_1: Blob;
    question_2: Blob;
    question_3: Blob;
    question_4: Blob;
    question_5: Blob;
    question_6: Blob;
    question_7: Blob;
    question_8: Blob;
    question_9: Blob;
    question_10: Blob;
    question_11: Blob;
}

// Create a type from the schema
type FormData = z.infer<typeof formSchema> & FormSubmissionData;

const NlpForm = () => {
    const [formSubmission] = useFormSubmissionMutation();

    const [audioUrls, setAudioUrls] = useState<string[]>(Array(11).fill(null));
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            question_1: undefined,
            question_2: undefined,
            question_3: undefined,
            question_4: undefined,
            question_5: undefined,
            question_6: undefined,
            question_7: undefined,
            question_8: undefined,
            question_9: undefined,
            question_10: undefined,
            question_11: undefined,
        },
    });



    const onSubmit = async (data: FormData) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Blob) {
                formData.append(key, value, `${key}.mp3`);
            } else {
                formData.append(key, value as string);
            }
        });

        setLoading(true);

        try {
            const response = await formSubmission(formData).unwrap();

            toast({
                title: "Submission Successful!",
                description: response.message || "Your form has been submitted.",
            });

            form.reset();
            setAudioUrls(Array(11).fill(null));

            setLoading(false);
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "There was an error submitting your form.",
            });

            setLoading(false);
            console.error('Error submitting form:', error);
        }
    };


    const addAudioElement = (blob: Blob, index: number) => {
        const url = URL.createObjectURL(blob);
        setAudioUrls((prev) => {
            const newUrls = [...prev];
            newUrls[index] = url;
            return newUrls;
        });

        const questionKey = `question_${index + 1}` as keyof FormData;
        form.setValue(questionKey, blob);
    };


    return (
        <div className="container mx-auto p-4 flex items-center justify-center light">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <Card className="responsive-card w-full">
                    <CardHeader>
                        <CardTitle className="text-center">Collecting Bangla Digits from (০-৯)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-md font-semibold">
                            Hello everyone,
                        </p>
                        <p className="mt-2 text-sm">
                            I’m reaching out for a bit of help with my thesis project, and I would
                            really appreciate your support. As part of my research, I need to collect
                            a large number of audio samples, and that's where you come in. Don’t worry;
                            it’ll only take around 10 minutes of your time, and I’m incredibly grateful
                            for your cooperation.
                        </p>
                        <p className="mt-4 font-semibold">Here's how you can help:</p>
                        <ul className="list-disc list-inside mt-2 space-y-2  text-sm">
                            <li>
                                Record the Bangla digits (০-৯) individually using the audio recorder
                                provided in this form. Each recording should be at least 3 seconds long.
                            </li>
                            <li>
                                To record each digit, press the record button in the form, say “০” (শূন্য),
                                and stop the recording. Then record “১” (এক), and so on until you complete all digits.
                            </li>
                        </ul>
                        <p className="mt-4 font-semibold">Important notes:</p>
                        <ul className="list-disc list-inside mt-2 space-y-2 text-sm text-red-500 font-bold">
                            <li>
                                Ensure that all recordings are at least 3 seconds long and clearly audible.
                            </li>
                        </ul>
                        <p className="mt-4">
                            Thank you so much for your time and support 🖤 Your contribution means a lot to me.
                        </p>
                    </CardContent>
                </Card>

                <Card className="responsive-card w-full mt-4">
                    <CardHeader></CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <Input placeholder="Enter your Name" {...field} />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_1"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Say any random number (like: ৩০৫, ২১১ etc)</FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 0)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[0] && (
                                                    <div>
                                                        <audio controls src={audioUrls[0]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="question_2"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "০" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 1)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[1] && (
                                                    <div>
                                                        <audio controls src={audioUrls[1]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "১" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 2)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[2] && (
                                                    <div>
                                                        <audio controls src={audioUrls[2]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "২" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 3)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[3] && (
                                                    <div>
                                                        <audio controls src={audioUrls[3]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৩" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 4)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[4] && (
                                                    <div>
                                                        <audio controls src={audioUrls[4]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৪" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 5)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[5] && (
                                                    <div>
                                                        <audio controls src={audioUrls[5]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৫" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 6)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[6] && (
                                                    <div>
                                                        <audio controls src={audioUrls[6]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৬" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 7)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[7] && (
                                                    <div>
                                                        <audio controls src={audioUrls[7]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৭" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 8)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[8] && (
                                                    <div>
                                                        <audio controls src={audioUrls[8]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৮" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 9)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[9] && (
                                                    <div>
                                                        <audio controls src={audioUrls[9]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="question_3"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Recording yourself saying "৯" </FormLabel>
                                            <div className="flex items-center justify-start space-x-4">
                                                <AudioRecorder
                                                    onRecordingComplete={(blob) => addAudioElement(blob, 10)}
                                                    audioTrackConstraints={{
                                                        noiseSuppression: true,
                                                        echoCancellation: true,
                                                    }}
                                                    downloadOnSavePress={false}
                                                    downloadFileExtension="mp3"
                                                />
                                                {audioUrls[10] && (
                                                    <div>
                                                        <audio controls src={audioUrls[10]} />
                                                    </div>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <motion.div
                                    className="w-full rounded"
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Uploading..." : "Submit"}
                                    </Button>
                                </motion.div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default NlpForm;
