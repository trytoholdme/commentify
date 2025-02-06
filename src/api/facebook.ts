import axios from 'axios';
import { Profile } from '../types';

interface PostComment {
  profile: Profile;
  postUrl: string;
  comment: string;
}

export async function getPostIdFromUrl(postUrl: string, proxy?: string): Promise<string> {
  // TODO: Implement Facebook post ID extraction
  throw new Error('Not implemented');
}

export async function comentarFacebook({ profile, postUrl, comment }: PostComment): Promise<boolean> {
  // TODO: Implement Facebook comment posting
  throw new Error('Not implemented');
}