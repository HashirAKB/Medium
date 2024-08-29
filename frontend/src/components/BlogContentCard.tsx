import DOMPurify from 'dompurify';

export const BlogContent = ({ content }) => {
    const sanitizedContent = DOMPurify.sanitize(content);
  
    return (
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    );
  };