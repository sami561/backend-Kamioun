import { z } from "zod";
import { objectIdSchema } from "./zod.types";
import { baseRequestSchema } from "./common.types";

const locationSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .optional();

const userObjectSchema = z.object({
  _id: objectIdSchema.optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).max(16),
  firstName: z.string().optional(),
  phoneNumber: z.string().optional(),
  lastName: z.string().optional(),
  active: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  account: objectIdSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  location: locationSchema,
  profilePhoto: z.string().optional(),
});

export const userSchema = userObjectSchema.superRefine((data, ctx) => {
  if (!data.email && !data.phoneNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either email or phoneNumber must be provided",
      path: ["email"],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either email or phoneNumber must be provided",
      path: ["phoneNumber"],
    });
  }
});

export type User = z.infer<typeof userSchema>;

export const registerUserDto = userObjectSchema
  .pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    address: true,
    city: true,
    location: true,
    profilePhoto: true,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.email && !data.phoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either email or phoneNumber must be provided",
        path: ["email"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either email or phoneNumber must be provided",
        path: ["phoneNumber"],
      });
    }
  });

export type RegisterUserDto = z.infer<typeof registerUserDto>;

export const registerUserRequestSchema = baseRequestSchema.extend({
  body: registerUserDto,
});

export const registerWithEmailDto = userObjectSchema
  .pick({
    email: true,
    password: true,
    firstName: true,
    lastName: true,
    address: true,
    city: true,
    location: true,
    profilePhoto: true,
  })
  .strict();

export const registerWithPhoneDto = userObjectSchema
  .pick({
    phoneNumber: true,
    password: true,
    firstName: true,
    lastName: true,
    address: true,
    city: true,
    location: true,
    profilePhoto: true,
  })
  .strict();

export type RegisterWithEmailDto = z.infer<typeof registerWithEmailDto>;
export type RegisterWithPhoneDto = z.infer<typeof registerWithPhoneDto>;

export const registerWithEmailRequestSchema = baseRequestSchema.extend({
  body: registerWithEmailDto,
});

export const registerWithPhoneRequestSchema = baseRequestSchema.extend({
  body: registerWithPhoneDto,
});

export const loginWithEmailDto = z
  .object({
    email: z.string().email(),
    password: z.string().min(4).max(16),
  })
  .strict();

export const loginWithPhoneDto = z
  .object({
    phoneNumber: z.string(),
    password: z.string().min(4).max(16),
  })
  .strict();

export type LoginWithEmailDto = z.infer<typeof loginWithEmailDto>;
export type LoginWithPhoneDto = z.infer<typeof loginWithPhoneDto>;

export const loginWithEmailRequestSchema = baseRequestSchema.extend({
  body: loginWithEmailDto,
});

export const loginWithPhoneRequestSchema = baseRequestSchema.extend({
  body: loginWithPhoneDto,
});

export const userPayload = userObjectSchema
  .pick({
    _id: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    account: true,
    address: true,
    city: true,
    profilePhoto: true,
  })
  .extend({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    iat: z.number().optional(),
    exp: z.number().optional(),
  })
  .strict();

export type UserPayload = z.infer<typeof userPayload>;

export const jwtSchema = z.object({
  token: z.string(),
  payload: userPayload,
});

export type JwtPayload = z.infer<typeof jwtSchema>;

export const updateCustomerDto = userObjectSchema
  .pick({
    firstName: true,
    lastName: true,
    address: true,
    city: true,
    location: true,
    profilePhoto: true,
  })
  .partial()
  .strict();

export type UpdateCustomerDto = z.infer<typeof updateCustomerDto>;

export const updateCustomerRequestSchema = baseRequestSchema.extend({
  body: updateCustomerDto,
});
