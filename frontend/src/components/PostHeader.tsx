import React from "react";
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
  createdAt: string,
  id: number,
  isPost: boolean
}

const PostHeader: React.FunctionComponent<Props> = ({createdAt, id, isPost}) => {
  const { board, threadId } = useParams();
  return(
    <div style={{background: '#44444f', borderBottom: '#1c1c1c', padding: '5px', width: '100%', height: '25px'}}>
      <span style={{marginRight: '10px'}}><b>Anonymous</b></span>
      <span style={{marginRight: '10px'}}>{createdAt}</span>
      <span style={{marginRight: '10px'}}>{id}</span>
      {!threadId && isPost && <Link style={{color: '#60a0dc'}}to={`/board/${board}/thread/${id}`}>Odpowiedz</Link>}
    </div>
  );
};

export default PostHeader;
