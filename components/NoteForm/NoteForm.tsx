import css from "./NoteForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import *as Yup from "yup";
import { createNote } from "@/lib/api";

interface NoteFormProps {
    onSuccess: () => void;
}

interface NoteFormValues {
    title: string;
    content: string;
    tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const INITIAL_VALUES: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
}

const NoteShema = Yup.object({
    title: Yup.string().min(3, "Too short").max(50, "Too long").required("Title is required"),
    content: Yup.string().max(500, "Too large"),
    tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]).required("Tag is not valid"),
});

function NoteForm({ onSuccess }: NoteFormProps) {
    const queryClient = useQueryClient();
   const {mutate, isPending} = useMutation({
       mutationFn: createNote,
       onSuccess: () => {
           queryClient.invalidateQueries({queryKey: ["notes"]});
           onSuccess();
       },
       onError: (error) => {
           console.error(error);
       }
    });
    const fieldId = useId();
    const handleSubmit = (values: NoteFormValues) => {
        mutate(values);
    }
    return (
        <Formik initialValues={INITIAL_VALUES} validationSchema={NoteShema} onSubmit={handleSubmit}>
        <Form className={css.form}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error }/>
                </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                    id={`${fieldId}-content`}
                    name="content"
                    rows={8}
                    className={css.textarea}
                />
                <ErrorMessage name="content" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                    <Field
                as="select"
                        id={`${fieldId}-tag`} name="tag" className={css.select}>
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </Field>
                <ErrorMessage name="tag" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
                    <button type="button" className={css.cancelButton}
                    onClick={onSuccess}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={isPending}
                >
                    Create note
                </button>
            </div>
            </Form>
            </Formik>
    );
}

export default NoteForm;