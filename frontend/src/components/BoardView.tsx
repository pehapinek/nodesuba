import React from "react";
import axios from "axios";
import Thread from "./Thread";
import { useParams } from 'react-router';
import PostForm from "./PostForm";
import ThreadType from "../interfaces/ThreadType";
import threadMock from '../mocks/thread'

const BoaedView: React.FunctionComponent = () => {
  const [threads, setThreads] = React.useState<ThreadType[]>([threadMock])

  const { board, page } = useParams();

  const url = `http://localhost:4000/board/${board}/page/${page}`

  React.useEffect(() => {
    axios(url)
      .then(response => {
      setThreads(response.data);
      })
      .catch(err => console.log(err))
  },[]);

  return(
    <div>
      <PostForm/>
      <div>
        {
          threads.map(thread => <Thread thread={thread}/>)
        }
      </div>
    </div>
  );
};

export default BoaedView;
