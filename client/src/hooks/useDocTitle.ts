import { useEffect } from 'react';

export function useDocTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title + ' | ReplyAI';
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (meta) meta.content = description;
    }
  }, [title, description]);
}
