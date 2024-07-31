"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Video } from "@prisma/client";
import { Trash, Upload } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "@/components/modals/alert-modal";
import { VideoUpload } from "@/components/ui/video-upload";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  label: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  imageUrl: z.string().url("Invalid video URL"),
});

type VideoFormValues = z.infer<typeof formSchema>;

interface VideoFormProps {
  initialData: Video | null;
}

const supabase = createClient();

export const VideoForm: React.FC<VideoFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit video" : "Upload new video";
  const label = initialData ? "Edit video" : "Upload new video";
  const description = initialData
    ? "Edit video details"
    : "Upload and add details for a new video";
  const toastMessage = initialData ? "Video updated." : "Video uploaded.";
  const action = initialData ? "Save changes" : "Upload";

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      label: "",
      tags: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.siteId}/videos/${params.videoId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.siteId}/videos`, data);
      }
      router.push(`/${params.siteId}/videos`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.siteId}/videos/${params.videoId}`);
      router.push(`/${params.siteId}/videos`);
      router.refresh();
      toast.success("Video deleted.");
    } catch (error) {
      toast.error("Make sure you removed all links using this video.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter video title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter video category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Enter video description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter tags"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <VideoUpload
                    value={field.value}
                    disabled={loading}
                    onChange={field.onChange}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
