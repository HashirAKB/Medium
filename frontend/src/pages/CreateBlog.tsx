import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PenIcon, XIcon } from 'lucide-react';
import { RichTextEditor } from "@/components/TextEditor";
import { useToast } from "@/components/ui/use-toast"
import { postSchema, PostInput } from "@hashirakb/common4medium";
import axiosInstance from "@/utils/axiosInstance";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

// Define your schema for form validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(50, {
    message: "Content must be at least 50 characters.",
  }).refine(
    (value) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount >= 2 && wordCount <= 2500;
    },
    {
      message: "Content must be between 2 and 2500 words.",
    }
  ),
  readingTime: z.number(),
});

function estimateReadingTime(wordCount: number): number {
  const wordsPerMinute = 50;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  if (minutes <= 1) {
    return 1;
  } else {
    return minutes;
  }
}

// Function to submit the blog post
const submitBlogPost = (data: PostInput): Promise<void> => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('mediumAuthToken');
        if (!token) {
            throw ("No authentication token found");
            // reject('No authentication token found');
        }
        data.published = true;
        axiosInstance.post('/api/v1/blog', data, {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        })
        .then(function (response) {
          if(response.status === 200){
            console.log("Blog post submitted successfully");
            resolve(response.data.id);
          }
        })
        .catch(function (error) {
          console.error("Error submitting blog post:", error.response?.data || error.message);
          reject(error);
        });
    });
  };

export default function CreateBlog() {
    const [wordCount, setwordCount] = useState(0)
    const [loading, setLoading] = useState(false);
    const [readingTime, setReadingTime] = useState(0);
    const { toast } = useToast()
    const navigate = useNavigate();

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      readingTime: 0
    },
  });

    const form = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: {
        title: "",
        content: "",
        published: false,
        tags: [],
        readingTime: 0,
        },
    });

    const content = watch('content');

    // Update word count whenever content changes
  useEffect(() => {
    const words = content.trim().split(/\s+/);
    setwordCount(words.length);
    setReadingTime(estimateReadingTime(words.length));
    setValue('readingTime', readingTime);
  }, [content, setValue]);

    const navigateToNewBlog = ({ blogid }: { blogid: string }) => {
      console.log("hebhe");
      console.log(blogid);
      navigate(`/post/${blogid}`);
    }
    
    const onSubmit = async (data: PostInput) => {
        // setwordCount(data.content.trim().split(/\s+/).length)
        setLoading(true);
        try {
          const blogid = await submitBlogPost(data);
          console.log("blogid:",blogid);
          console.log("Blog post submitted successfully");
          reset();
          toast({ title: "Blog post created!", description: `Title: ${data.title}` });
          navigateToNewBlog({ blogid });
        } catch (error) {
          console.error("Failed to submit blog post", error);
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <PenIcon className="w-6 h-6" />
            Create New Blog Post
          </CardTitle>
          <p className="text-sm text-muted-foreground">Write and publish your thoughts to the world.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6">
                Title
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    id="title"
                    type="text"
                    placeholder=""
                    className="mt-1 block w-full text-xl md:text-2xl font-semibold"
                    {...field}
                  />
                )}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium leading-6">
                Content
              </label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    id="content"
                    placeholder=""
                    className="mt-1 block w-full min-h-[300px] lg:min-h-[500px]"
                    {...field}
                  />
                )}
              />
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
              <Controller
                name="readingTime"
                control={control}
                render={({ field }) => (
                <p className="text-sm text-muted-foreground">
                  Word count: {wordCount} | Estimated reading time: {field.value} Minutes
                  </p>
                )}
                />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => {
            reset();
            navigate('/');
          }}>
            <XIcon className="w-4 h-4" />
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2" onClick={handleSubmit(onSubmit)}>
            <PenIcon className="w-4 h-4" />
            Publish
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
