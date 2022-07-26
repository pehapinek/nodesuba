import React from "react";
import Post from "./Post";
import Reply from "./Reply";
import ThreadType from "../interfaces/ThreadType";

interface Props {
  thread: ThreadType
}

const Thread: React.FunctionComponent<Props> = ({thread}) => {
  return(
    <div style={{
      borderTop: '1px solid #d9bfb7',
      margin: '15px',
      marginRight: '10px',
      marginLeft: '22px',
      overflow:'hidden'
    }}>
      <Post
        thread={thread}
      />

      <div>
        {
          thread.replies.map(reply => <Reply reply={reply}/>)
        }
      </div>
    </div>
  );
};

export default Thread;
