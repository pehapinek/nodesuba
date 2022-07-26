import axios from "axios";
import React from "react";
import { useParams } from 'react-router';
import PostBody from '../interfaces/PostBody';
import FormState from '../interfaces/FormState'
import formBody from "../mocks/formBody";

const tdStyle = {
  background: '#333', color: '#60a0dc', border: '1px solid #444', fontSize: '10pt', fontWeight: 'bold'}

const PostForm: React.FunctionComponent = () => {
  const [state, setState] = React.useState<FormState>(formBody);

  const { board, thread } = useParams();

  const url = 'http://localhost:4000/post';

  const onChange: React.FormEventHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.currentTarget.name]: e.currentTarget.value
    })
  };

  const onSubmit = () => {
    let postBody: PostBody = {
      boardId: board,
      name: state.topic,
      content: state.post,
      password: '',
      email: state.eMail
    }

    if(thread) {
      postBody.parentId= Number(thread);
    }

    axios.post(url, postBody)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  return(
    <table style={{display: 'flex', justifyContent: 'center'}}>
      <tbody>
        <tr>
          <td style={tdStyle}>E-mail</td>
          <td>
            <input style={{display: 'flex'}} type='text' name='eMail' onChange={onChange}></input>
          </td>
        </tr>

        <tr>
          <td style={tdStyle}>Temat</td>
          <td>
            <input style={{display: 'flex'}} type='text' name='topic' onChange={onChange}></input>
          </td>
        </tr>

        <tr>
          <td style={tdStyle}>Wiadomość</td>
          <td>
            <textarea style={{height: '150px', width: '200px'}} name='post' onChange={onChange}></textarea>
          </td>
        </tr>

        <tr>
          <td></td>
          <td>
            <button onClick={onSubmit}>Wyślij</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default PostForm;
