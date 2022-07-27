import { Button, Checkbox, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import httpRequest from './utils/request';
import useFetch from './utils/useFetch'

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => value + 1);
}
const App = () => {
  const forceUpdate = useForceUpdate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) ?? null)
  const handleRefresh = async () => {
    try {
      const res = await httpRequest.post('/auth/token', { token: JSON.parse(localStorage.getItem('refreshToken')) })
      if (res.data.success) {
        localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
      }
    } catch (error) {
      // console.log(error)
    }
  }

  const checkLogin = async () => {
    try {
      const res = await httpRequest.get('/auth/login/success')
      console.log(res)
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])



  const { data: posts, error } = useFetch('/post')
  useEffect(() => {
    if (error) {
      handleRefresh()
      forceUpdate()
    }
  }, [error])



  const onFinish = async (values) => {
    const { remember, ...otherData } = values
    const res = await httpRequest.post('/auth/login', otherData)
    if (res.data.success) {
      setUser(res.data.details)
      localStorage.setItem('user', JSON.stringify(res.data.details))
      localStorage.setItem('accessToken', JSON.stringify(res.data.accessToken))
      localStorage.setItem('refreshToken', JSON.stringify(res.data.refreshToken))
    }
  };

  const handleLogout = async () => {
    const res = await httpRequest.delete('/auth/logout')
    if (res.data.success) {
      console.log('Logged out')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('accessToken')
      setUser({})
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleLoginWithGoogle = () => {
    window.location.href = 'http://localhost:5000/auth/google'
  }
  const handleLoginWithFacebook = () => {
    window.location.href = 'http://localhost:5000/auth/facebook'
  }

  return (
    <div className="wrapper">
      {
        !!user ? <div>
          {`Hello ${user.username}`}
          <button onClick={handleRefresh}>Get token</button>
          <button onClick={handleLogout}>Log out</button>
        </div> : (
          <>
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                wrapperCol={{
                  offset: 8,
                  span: 8,
                }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 8,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <button onClick={handleLoginWithGoogle}>Google</button>
            <button onClick={handleLoginWithFacebook}>Facebook</button>
          </>
        )
      }
    </div>
  );
};

export default App;
