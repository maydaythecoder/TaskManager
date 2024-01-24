/*
 * Created Date: Wednesday December 2nd 2023
 * Author: Madusha Cooray
 * Email: hello@madusha.com
 * -----
 * Last Modified: Wednesday December 2nd 2023 4:53:21 pm
 * -----
 * Copyright (c) 2023 www.madusha.com
 */

export interface UserData {
    // describes the data that a user is expected expected to contain
    uid: string;
    bio?: string;
    email: string | object;
    profilePhoto: string;
    username: string;
    website?: string;
    permissions: {
      admin: boolean;
      superAdmin: boolean;
      level: number;
    };
    communications: {
      email: { comments: boolean; projects: boolean; updates: boolean };
      push: { comments: boolean; projects: boolean; updates: boolean };
    };
    socials: {
      linkedin: string;
      twitter: string;
      github: string;
    };
    fcmToken?: string;
  }