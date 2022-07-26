import React from "react";
import ThreadType from '../interfaces/ThreadType';
import PostHeader from'./PostHeader';

interface Props {
  thread: ThreadType
}

const Post: React.FunctionComponent<Props> = ({thread}) => {
  
  return(
    <div style={{
    margin: '15px',
    marginRight: '10px',
    display: 'inlineBlock',
    maxWidth: '500px',
    overflow:'hidden',
    fontSize: '10pt',
    textAlign: 'justify',
    border: '1px solid #d9bfb7',
    }}>
      <PostHeader createdAt={thread.createdAt} id={thread.id} isPost={true}/>
      <p style={{
        margin: '15px'
      }}>
        {thread.content}
      </p>
    </div>
  );
};

export default Post;
