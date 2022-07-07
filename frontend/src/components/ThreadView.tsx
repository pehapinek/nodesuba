import React from "react";
import PostForm from "./PostForm";
import { useParams } from 'react-router';
import ThreadType from "../interfaces/ThreadType";
import Thread from "./Thread";
import axios from "axios";
import threadMock from '../mocks/thread'

const ThreadView: React.FunctionComponent = () => {
  const [thread, setThread] = React.useState<ThreadType>(threadMock);

  const {board, threadId} = useParams();

  const url = `http://localhost:4000/board/${board}/thread/${threadId}`;

  React.useEffect(() => {
    axios.get(url)
      .then(res => setThread(res.data))
      .catch(err => console.log(err))
  },[]);

  return(
    <div>
      <PostForm/>
      <Thread thread={thread}/>
    </div>
  );
};

export default ThreadView;
