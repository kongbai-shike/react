import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Form, Input, Table, Modal, Select, Tag, Pagination, Popconfirm, message, Card } from 'antd';
import { UserOutlined, LockOutlined, QuestionCircleOutlined, LogoutOutlined, UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// 登录组件
const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    setTimeout(() => {
      const { username, password } = values;
      
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('jwt_token', 'mock-jwt-token');
        localStorage.setItem('role', '1');
        
        message.success('登录成功');
        onLoginSuccess();
        navigate('/users');
      } else {
        message.error('用户名或密码错误');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f2f5'
    }}>
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '24px', marginBottom: 8 }}>Quiz后台管理系统登录</h1>
        </div>
        
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入用户名" size="large" />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

// 主布局组件
const MainLayout = ({ children, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: '/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/questions', icon: <QuestionCircleOutlined />, label: '题目管理' },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        fontSize: '24px', 
        backgroundColor: 'rgb(238, 241, 246)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        Quiz后台管理
        <div>
          <span style={{ marginRight: '10px' }}>管理员</span>
          <Button type="danger" size="small" icon={<LogoutOutlined />} onClick={onLogout}>
            退出
          </Button>
        </div>
      </Header>
      
      <Layout>
        <Sider width={200} style={{ backgroundColor: 'rgb(238, 241, 246)' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        
        <Content style={{ margin: '16px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280, borderRadius: 4 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

// 用户管理页面
const UsersPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockUsers = [
    { id: 1, userName: 'admin', userPassword: '******', userRole: 1, updateTime: '2024-01-15T10:30:00' },
    { id: 2, userName: 'user1', userPassword: '******', userRole: 0, updateTime: '2024-01-16T14:20:00' },
    { id: 3, userName: 'user2', userPassword: '******', userRole: 0, updateTime: '2024-01-17T09:15:00' },
    { id: 4, userName: 'test', userPassword: '******', userRole: 0, updateTime: '2024-01-18T16:45:00' },
    { id: 5, userName: 'demo', userPassword: '******', userRole: 0, updateTime: '2024-01-19T11:10:00' },
    { id: 6, userName: 'guest', userPassword: '******', userRole: 0, updateTime: '2024-01-20T08:30:00' }
  ];

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchKeyword]);

  const loadUsers = () => {
    setTimeout(() => {
      let filteredUsers = [...mockUsers];
      
      if (searchKeyword) {
        filteredUsers = filteredUsers.filter(user =>
          user.userName.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      const startIndex = (currentPage - 1) * pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
      
      setUsers(paginatedUsers);
      setTotal(filteredUsers.length);
    }, 300);
  };

  const handleSearch = (values) => {
    setSearchKeyword(values.keyword);
    setCurrentPage(1);
  };

  const handleAddUser = () => setAddModalVisible(true);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success(`删除用户 ${id} 成功`);
    loadUsers();
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'userName', key: 'userName', width: 180 },
    { title: '密码', dataIndex: 'userPassword', key: 'userPassword', width: 180 },
    { 
      title: '用户角色', 
      dataIndex: 'userRole', 
      key: 'userRole', 
      width: 120,
      render: (role) => <Tag color={role === 1 ? 'red' : 'blue'}>{role === 1 ? '管理员' : '普通用户'}</Tag>
    },
    { 
      title: '更新时间', 
      dataIndex: 'updateTime', 
      key: 'updateTime', 
      width: 180,
      render: (date) => formatDate(date)
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Popconfirm title="此操作将永久删除该用户, 是否继续?" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item label="用户名" name="keyword" style={{ marginBottom: 16 }}>
          <Input placeholder="请输入用户名关键词" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item style={{ marginBottom: 16, marginLeft: 'auto' }}>
          <Button type="success" icon={<UserAddOutlined />} onClick={handleAddUser}>添加用户</Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={users} rowKey="id" pagination={false} style={{ width: '80%' }} />
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={handlePageChange} showSizeChanger={false} showTotal={(total) => `共 ${total} 条`} />
      </div>

      {/* 添加用户弹窗 */}
      <Modal
        title="添加新用户"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('添加用户成功');
            setAddModalVisible(false);
            loadUsers();
          }}>确定</Button>,
        ]}
        width={400}
      >
        <Form layout="vertical" initialValues={{ userRole: 0 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item label="确认密码" name="checkpassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item label="用户角色" name="userRole" rules={[{ required: true, message: '请选择用户角色' }]}>
            <Select placeholder="请选择用户角色">
              <Option value={0}>普通用户</Option>
              <Option value={1}>管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('更新用户成功');
            setEditModalVisible(false);
            loadUsers();
          }}>确定</Button>,
        ]}
        width={400}
      >
        <Form layout="vertical" initialValues={{ username: editingUser?.userName, userRole: editingUser?.userRole }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="密码" name="password">
            <Input.Password placeholder="留空表示不修改密码" />
          </Form.Item>
          <Form.Item label="用户角色" name="userRole" rules={[{ required: true, message: '请选择用户角色' }]}>
            <Select placeholder="请选择用户角色">
              <Option value={0}>普通用户</Option>
              <Option value={1}>管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 题目管理页面
const QuestionsPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockQuestions = [
    { id: 1, questionText: 'Vue是什么？', options: ['前端框架', '后端语言', '数据库', '操作系统'], answer: 'a' },
    { id: 2, questionText: 'React的核心特性是什么？', options: ['虚拟DOM', '双向数据绑定', '模板语法', '计算属性'], answer: 'a' },
    { id: 3, questionText: 'JavaScript是哪种语言？', options: ['编译型', '解释型', '机器语言', '汇编语言'], answer: 'b' },
    { id: 4, questionText: 'CSS用于什么？', options: ['网页结构', '网页样式', '网页行为', '网页数据'], answer: 'b' },
    { id: 5, questionText: 'HTML5的新特性？', options: ['Canvas', 'Flash', 'Applet', 'ActiveX'], answer: 'a' },
    { id: 6, questionText: '什么是AJAX？', options: ['异步JavaScript和XML', '同步JavaScript', '数据库查询', '服务器语言'], answer: 'a' }
  ];

  useEffect(() => {
    loadQuestions();
  }, [currentPage, searchKeyword]);

  const loadQuestions = () => {
    setTimeout(() => {
      let filteredQuestions = [...mockQuestions];
      
      if (searchKeyword) {
        filteredQuestions = filteredQuestions.filter(question =>
          question.questionText.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          question.options.some(option => option.toLowerCase().includes(searchKeyword.toLowerCase()))
        );
      }

      const startIndex = (currentPage - 1) * pageSize;
      const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + pageSize);
      
      setQuestions(paginatedQuestions);
      setTotal(filteredQuestions.length);
    }, 300);
  };

  const handleSearch = (values) => {
    setSearchKeyword(values.keyword);
    setCurrentPage(1);
  };

  const handleAddQuestion = () => setAddModalVisible(true);

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    message.success(`删除题目 ${id} 成功`);
    loadQuestions();
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 50 },
    { title: '题目', dataIndex: 'questionText', key: 'questionText', width: 250 },
    { 
      title: '选项', 
      dataIndex: 'options', 
      key: 'options', 
      width: 260,
      render: (options) => (
        <div>
          {options.map((option, index) => (
            <div key={index}>{String.fromCharCode(97 + index)}. {option}</div>
          ))}
        </div>
      )
    },
    { 
      title: '答案', 
      dataIndex: 'answer', 
      key: 'answer', 
      width: 180,
      render: (answer) => <Tag color="green" style={{ fontSize: '16px' }}>{answer?.toUpperCase()}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Popconfirm title="此操作将永久删除该题目, 是否继续?" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline" onFinish={handleSearch} style={{ marginBottom: 16 }}>
        <Form.Item label="题目" name="keyword" style={{ marginBottom: 16 }}>
          <Input placeholder="请输入题目关键词" style={{ width: 200 }} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">查询</Button>
        </Form.Item>
        <Form.Item style={{ marginBottom: 16, marginLeft: 'auto' }}>
          <Button type="success" icon={<PlusOutlined />} onClick={handleAddQuestion}>添加题目</Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={questions} rowKey="id" pagination={false} style={{ width: '80%' }} />
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={handlePageChange} showSizeChanger={false} showTotal={(total) => `共 ${total} 条`} />
      </div>

      {/* 添加题目弹窗 */}
      <Modal
        title="添加新题目"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('添加题目成功');
            setAddModalVisible(false);
            loadQuestions();
          }}>确定</Button>,
        ]}
        width={400}
      >
        <Form layout="vertical">
          <Form.Item label="题目" name="question" rules={[{ required: true, message: '请输入题目' }]}>
            <Input placeholder="请输入题目" />
          </Form.Item>
          <Form.Item label="选项a" name="optiona" rules={[{ required: true, message: '请输入选项a' }]}>
            <Input placeholder="请输入选项a" />
          </Form.Item>
          <Form.Item label="选项b" name="optionb" rules={[{ required: true, message: '请输入选项b' }]}>
            <Input placeholder="请输入选项b" />
          </Form.Item>
          <Form.Item label="选项c" name="optionc">
            <Input placeholder="请输入选项c" />
          </Form.Item>
          <Form.Item label="选项d" name="optiond">
            <Input placeholder="请输入选项d" />
          </Form.Item>
          <Form.Item label="答案" name="answer" rules={[{ required: true, message: '请输入答案' }]}>
            <Input placeholder="请输入答案（a/b/c/d）" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑题目弹窗 */}
      <Modal
        title="编辑题目"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => {
            message.success('更新题目成功');
            setEditModalVisible(false);
            loadQuestions();
          }}>确定</Button>,
        ]}
        width={400}
      >
        <Form layout="vertical" initialValues={{
          question: editingQuestion?.questionText,
          optiona: editingQuestion?.options[0] || '',
          optionb: editingQuestion?.options[1] || '',
          optionc: editingQuestion?.options[2] || '',
          optiond: editingQuestion?.options[3] || '',
          answer: editingQuestion?.answer
        }}>
          <Form.Item label="题目" name="question" rules={[{ required: true, message: '请输入题目' }]}>
            <Input placeholder="请输入题目" />
          </Form.Item>
          <Form.Item label="选项a" name="optiona" rules={[{ required: true, message: '请输入选项a' }]}>
            <Input placeholder="请输入选项a" />
          </Form.Item>
          <Form.Item label="选项b" name="optionb" rules={[{ required: true, message: '请输入选项b' }]}>
            <Input placeholder="请输入选项b" />
          </Form.Item>
          <Form.Item label="选项c" name="optionc">
            <Input placeholder="请输入选项c" />
          </Form.Item>
          <Form.Item label="选项d" name="optiond">
            <Input placeholder="请输入选项d" />
          </Form.Item>
          <Form.Item label="答案" name="answer" rules={[{ required: true, message: '请输入答案' }]}>
            <Input placeholder="请输入答案（a/b/c/d）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 主应用组件
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt_token'));

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('role');
    message.success('已退出登录');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
        
        <Route path="/" element={
          isAuthenticated ? (
            <MainLayout onLogout={handleLogout}>
              <Navigate to="/users" />
            </MainLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/users" element={
          isAuthenticated ? (
            <MainLayout onLogout={handleLogout}>
              <UsersPage />
            </MainLayout>
          ) : <Navigate to="/login" />
        } />
        
        <Route path="/questions" element={
          isAuthenticated ? (
            <MainLayout onLogout={handleLogout}>
              <QuestionsPage />
            </MainLayout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;