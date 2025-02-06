export interface Profile {
  id: string;
  name: string;
  cookie: string;
  proxy?: string; // Novo campo opcional para proxy
}

export interface Comment {
  id: string;
  text: string;
}

export interface AutomationConfig {
  postUrl: string;
  intervalSeconds: number;
  comments: Comment[];
  profiles: Profile[];
}