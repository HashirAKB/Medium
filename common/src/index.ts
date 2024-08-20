import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
export type SigninInput = z.infer<typeof signinSchema>;

export const userUpdateSchema = z.object({
    name: z.string().optional(),
    password: z.string().min(6).optional(),
    bio: z.string().optional(),
    profileImage: z.string().url().optional(),
    followingIds: z.array(z.string()).optional(),
    tagFollowIds: z.array(z.string()).optional(),
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const tagFollowSchema = z.object({
    tagId: z.string(),
});
export type TagFollowInput = z.infer<typeof tagFollowSchema>;

export const tagSchema = z.object({
    name: z.string().min(1),
});
export type tagInput = z.infer<typeof tagSchema>;

export const likeSchema = z.object({
    postId: z.string().uuid(),
});
export type likeInput = z.infer<typeof likeSchema>;

export const followSchema = z.object({
    followingId: z.string(),
});
export type followInput = z.infer<typeof followSchema>;

export const commentSchema = z.object({
    content: z.string().min(1),
    postId: z.string().uuid(),
});
export type commentInput = z.infer<typeof commentSchema>;

export const postSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    published: z.boolean().optional(),
    tags: z.array(z.string().uuid()).optional(), // Array of Tag IDs
});
export type PostInput = z.infer<typeof postSchema>;