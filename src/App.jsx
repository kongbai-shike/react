import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Form, Input, Table, Modal, Select, Tag, Pagination, Popconfirm, message, Card, Alert } from 'antd';
import { UserOutlined, LockOutlined, QuestionCircleOutlined, LogoutOutlined, UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// ==================== 登录组件 ====================
const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    setTimeout(() => {
      const { username, password } = values;
      
      // 从localStorage获取用户数据
      const savedUsers = localStorage.getItem('users');
      let users = [];
      
      if (savedUsers) {
        users = JSON.parse(savedUsers);
      } else {
        // 如果没有用户数据，使用初始数据
        const initialMockUsers = [
          { id: 1, userName: 'admin', userPassword: 'admin123', userRole: 1, updateTime: '2024-01-15T10:30:00' },
          { id: 2, userName: 'user1', userPassword: '123456', userRole: 0, updateTime: '2024-01-16T14:20:00' },
          { id: 3, userName: 'user2', userPassword: '123456', userRole: 0, updateTime: '2024-01-17T09:15:00' },
          { id: 4, userName: 'test', userPassword: '123456', userRole: 0, updateTime: '2024-01-18T16:45:00' },
          { id: 5, userName: 'demo', userPassword: '123456', userRole: 0, updateTime: '2024-01-19T11:10:00' },
          { id: 6, userName: 'guest', userPassword: '123456', userRole: 0, updateTime: '2024-01-20T08:30:00' }
        ];
        users = initialMockUsers;
        localStorage.setItem('users', JSON.stringify(initialMockUsers));
      }
      
      // 查找用户
      const user = users.find(u => u.userName === username && u.userPassword === password);
      
      if (user) {
        // 检查用户角色是否为管理员
        if (user.userRole === 1) {
          localStorage.setItem('jwt_token', 'mock-jwt-token');
          localStorage.setItem('role', '1');
          localStorage.setItem('currentUserId', user.id.toString());
          
          message.success('登录成功');
          onLoginSuccess();
          navigate('/users');
        } else {
          message.error('权限不足，只有管理员可以登录后台管理系统');
        }
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
      <Card style={{ width: 450 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '24px', marginBottom: 16 }}>Quiz后台管理系统登录</h1>
          
          {/* 添加管理员账号提示 */}
          <Alert
            message="管理员账号"
            description={
              <div>
                <p>默认管理员账号：</p>
                <p>用户名：<strong>admin</strong></p>
                <p>密码：<strong>admin123</strong></p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: 8 }}>
                  提示：只有管理员角色的用户（userRole=1）可以登录后台管理系统
                </p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
        </div>
        
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名" 
              size="large" 
            />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码" 
              size="large" 
            />
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

// ==================== 主布局组件 ====================
const MainLayout = ({ children, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 获取当前登录用户信息
    const savedUsers = localStorage.getItem('users');
    const currentUserId = localStorage.getItem('currentUserId');
    
    if (savedUsers && currentUserId) {
      const users = JSON.parse(savedUsers);
      const user = users.find(u => u.id.toString() === currentUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

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
          <span style={{ marginRight: '10px' }}>
            欢迎，{currentUser ? currentUser.userName : '管理员'}
          </span>
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

// ==================== 用户管理页面 ====================
const UsersPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 初始模拟数据 - admin账号为管理员，其他为用户
  const initialMockUsers = [
    { id: 1, userName: 'admin', userPassword: 'admin123', userRole: 1, updateTime: '2024-01-15T10:30:00' },
    { id: 2, userName: 'user1', userPassword: '123456', userRole: 0, updateTime: '2024-01-16T14:20:00' },
    { id: 3, userName: 'user2', userPassword: '123456', userRole: 0, updateTime: '2024-01-17T09:15:00' },
    { id: 4, userName: 'test', userPassword: '123456', userRole: 0, updateTime: '2024-01-18T16:45:00' },
    { id: 5, userName: 'demo', userPassword: '123456', userRole: 0, updateTime: '2024-01-19T11:10:00' },
    { id: 6, userName: 'guest', userPassword: '123456', userRole: 0, updateTime: '2024-01-20T08:30:00' }
  ];

  // 初始化数据
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialMockUsers);
      localStorage.setItem('users', JSON.stringify(initialMockUsers));
    }
  }, []);

  // 当users或搜索条件变化时，更新显示的数据
  useEffect(() => {
    filterAndPaginateUsers();
  }, [users, currentPage, searchKeyword]);

  const filterAndPaginateUsers = () => {
    let filteredUsers = [...users];
    
    if (searchKeyword) {
      filteredUsers = filteredUsers.filter(user =>
        user.userName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setTotal(filteredUsers.length);
    
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
    
    setDisplayUsers(paginatedUsers);
  };

  // 保存用户数据到localStorage和状态
  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const handleSearch = (values) => {
    setSearchKeyword(values.keyword);
    setCurrentPage(1);
  };

  const handleAddUser = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      username: user.userName,
      userRole: user.userRole
    });
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    // 防止删除当前登录的管理员账号
    const currentUserId = localStorage.getItem('currentUserId');
    if (id.toString() === currentUserId) {
      message.error('不能删除当前登录的账号！');
      return;
    }
    
    const newUsers = users.filter(user => user.id !== id);
    saveUsers(newUsers);
    message.success('删除用户成功');
  };

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      // 检查密码是否一致
      if (values.password !== values.checkpassword) {
        message.error('两次输入的密码不一致');
        return;
      }

      // 检查用户名是否已存在
      const usernameExists = users.some(user => user.userName === values.username);
      if (usernameExists) {
        message.error('用户名已存在，请使用其他用户名');
        return;
      }

      // 生成新ID
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      
      // 创建新用户
      const newUser = {
        id: newId,
        userName: values.username,
        userPassword: values.password,
        userRole: values.userRole,
        updateTime: new Date().toISOString()
      };

      // 添加到用户列表
      const newUsers = [...users, newUser];
      saveUsers(newUsers);

      message.success('添加用户成功');
      addForm.resetFields();
      setAddModalVisible(false);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      // 检查用户名是否冲突（除了自己）
      if (values.username !== editingUser.userName) {
        const usernameExists = users.some(u => 
          u.id !== editingUser.id && u.userName === values.username
        );
        if (usernameExists) {
          message.error('用户名已存在，请使用其他用户名');
          throw new Error('用户名已存在');
        }
      }
      
      // 更新用户
      const newUsers = users.map(user => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            userName: values.username,
            userPassword: values.password || user.userPassword,
            userRole: values.userRole,
            updateTime: new Date().toISOString()
          };
        }
        return user;
      });

      saveUsers(newUsers);
      message.success('更新用户成功');
      setEditModalVisible(false);
    }).catch(error => {
      if (error.message !== '用户名已存在') {
        console.error('表单验证失败:', error);
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { 
      title: '用户名', 
      dataIndex: 'userName', 
      key: 'userName', 
      width: 180,
      render: (text, record) => (
        <span>
          {text}
          {record.userRole === 1 && (
            <Tag color="red" style={{ marginLeft: 8 }}>管理员</Tag>
          )}
        </span>
      )
    },
    { 
      title: '密码', 
      dataIndex: 'userPassword', 
      key: 'userPassword', 
      width: 180,
      render: (password) => '•'.repeat(6)
    },
    { 
      title: '用户角色', 
      dataIndex: 'userRole', 
      key: 'userRole', 
      width: 120,
      render: (role) => (
        <Tag color={role === 1 ? 'red' : 'blue'}>
          {role === 1 ? '管理员' : '普通用户'}
        </Tag>
      )
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
      render: (_, record) => {
        const currentUserId = localStorage.getItem('currentUserId');
        const isCurrentUser = record.id.toString() === currentUserId;
        
        return (
          <>
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)} 
              style={{ marginRight: 8 }}
            >
              编辑
            </Button>
            <Popconfirm 
              title="此操作将永久删除该用户, 是否继续?" 
              onConfirm={() => handleDelete(record.id)} 
              okText="确定" 
              cancelText="取消"
              disabled={isCurrentUser}
            >
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
                disabled={isCurrentUser}
              >
                删除
              </Button>
            </Popconfirm>
            {isCurrentUser && (
              <Tag color="orange" style={{ marginLeft: 8 }}>当前用户</Tag>
            )}
          </>
        );
      },
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

      <Alert
        message="用户管理说明"
        description={
          <div>
            <p>1. 只有管理员角色（userRole=1）的用户可以登录后台管理系统</p>
            <p>2. 默认管理员账号：admin / admin123</p>
            <p>3. 可以添加新的管理员或普通用户</p>
            <p>4. 不能删除当前登录的用户账号</p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Table columns={columns} dataSource={displayUsers} rowKey="id" pagination={false} style={{ width: '80%' }} />
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Pagination 
          current={currentPage} 
          pageSize={pageSize} 
          total={total} 
          onChange={handlePageChange} 
          showSizeChanger={false} 
          showTotal={(total) => `共 ${total} 条`} 
        />
      </div>

      {/* 添加用户弹窗 */}
      <Modal
        title="添加新用户"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAddSubmit}>确定</Button>,
        ]}
        width={400}
      >
        <Form form={addForm} layout="vertical" initialValues={{ userRole: 0 }}>
          <Form.Item 
            label="用户名" 
            name="username" 
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item 
            label="密码" 
            name="password" 
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item 
            label="确认密码" 
            name="checkpassword" 
            rules={[{ required: true, message: '请确认密码' }]}
          >
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item 
            label="用户角色" 
            name="userRole" 
            rules={[{ required: true, message: '请选择用户角色' }]}
          >
            <Select placeholder="请选择用户角色">
              <Option value={0}>普通用户</Option>
              <Option value={1}>管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        title={`编辑用户 ${editingUser?.userName}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>确定</Button>,
        ]}
        width={400}
      >
        {editingUser && (
          <Form form={editForm} layout="vertical">
            <Form.Item 
              label="用户名" 
              name="username" 
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少3个字符' },
                { max: 20, message: '用户名最多20个字符' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' }
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input.Password placeholder="留空表示不修改密码" />
            </Form.Item>
            <Form.Item 
              label="用户角色" 
              name="userRole" 
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select placeholder="请选择用户角色">
                <Option value={0}>普通用户</Option>
                <Option value={1}>管理员</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

// ==================== 题目管理页面 ====================
const QuestionsPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 初始模拟数据
  const initialMockQuestions = [
    { id: 1, questionText: 'Vue是什么？', options: ['前端框架', '后端语言', '数据库', '操作系统'], answer: 'a' },
    { id: 2, questionText: 'React的核心特性是什么？', options: ['虚拟DOM', '双向数据绑定', '模板语法', '计算属性'], answer: 'a' },
    { id: 3, questionText: 'JavaScript是哪种语言？', options: ['编译型', '解释型', '机器语言', '汇编语言'], answer: 'b' },
    { id: 4, questionText: 'CSS用于什么？', options: ['网页结构', '网页样式', '网页行为', '网页数据'], answer: 'b' },
    { id: 5, questionText: 'HTML5的新特性？', options: ['Canvas', 'Flash', 'Applet', 'ActiveX'], answer: 'a' },
    { id: 6, questionText: '什么是AJAX？', options: ['异步JavaScript和XML', '同步JavaScript', '数据库查询', '服务器语言'], answer: 'a' }
  ];

  // 初始化数据
  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      setQuestions(initialMockQuestions);
      localStorage.setItem('questions', JSON.stringify(initialMockQuestions));
    }
  }, []);

  // 当questions或搜索条件变化时，更新显示的数据
  useEffect(() => {
    filterAndPaginateQuestions();
  }, [questions, currentPage, searchKeyword]);

  const filterAndPaginateQuestions = () => {
    let filteredQuestions = [...questions];
    
    if (searchKeyword) {
      filteredQuestions = filteredQuestions.filter(question =>
        question.questionText.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        question.options.some(option => option.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    setTotal(filteredQuestions.length);
    
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + pageSize);
    
    setDisplayQuestions(paginatedQuestions);
  };

  // 保存题目数据到localStorage和状态
  const saveQuestions = (newQuestions) => {
    setQuestions(newQuestions);
    localStorage.setItem('questions', JSON.stringify(newQuestions));
  };

  const handleSearch = (values) => {
    setSearchKeyword(values.keyword);
    setCurrentPage(1);
  };

  const handleAddQuestion = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    editForm.setFieldsValue({
      question: question.questionText,
      optiona: question.options[0] || '',
      optionb: question.options[1] || '',
      optionc: question.options[2] || '',
      optiond: question.options[3] || '',
      answer: question.answer
    });
    setEditModalVisible(true);
  };

  const handleDelete = (id) => {
    const newQuestions = questions.filter(question => question.id !== id);
    saveQuestions(newQuestions);
    message.success('删除题目成功');
  };

  const handleAddSubmit = () => {
    addForm.validateFields().then(values => {
      // 生成新ID
      const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
      
      // 创建新题目
      const newQuestion = {
        id: newId,
        questionText: values.question,
        options: [
          values.optiona,
          values.optionb,
          values.optionc || '',
          values.optiond || ''
        ].filter(option => option !== ''),
        answer: values.answer.toLowerCase()
      };

      // 添加到题目列表
      const newQuestions = [...questions, newQuestion];
      saveQuestions(newQuestions);

      message.success('添加题目成功');
      addForm.resetFields();
      setAddModalVisible(false);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      // 更新题目
      const newQuestions = questions.map(question => {
        if (question.id === editingQuestion.id) {
          return {
            ...question,
            questionText: values.question,
            options: [
              values.optiona,
              values.optionb,
              values.optionc || '',
              values.optiond || ''
            ].filter(option => option !== ''),
            answer: values.answer.toLowerCase()
          };
        }
        return question;
      });

      saveQuestions(newQuestions);
      message.success('更新题目成功');
      setEditModalVisible(false);
    }).catch(error => {
      console.error('表单验证失败:', error);
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <div key={index}>
              <span style={{ fontWeight: 'bold', marginRight: 4 }}>
                {String.fromCharCode(97 + index)}.
              </span>
              {option}
            </div>
          ))}
        </div>
      )
    },
    { 
      title: '答案', 
      dataIndex: 'answer', 
      key: 'answer', 
      width: 180,
      render: (answer) => (
        <Tag color="green" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {answer?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            编辑
          </Button>
          <Popconfirm 
            title="此操作将永久删除该题目, 是否继续?" 
            onConfirm={() => handleDelete(record.id)} 
            okText="确定" 
            cancelText="取消"
          >
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

      <Table columns={columns} dataSource={displayQuestions} rowKey="id" pagination={false} style={{ width: '80%' }} />
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Pagination 
          current={currentPage} 
          pageSize={pageSize} 
          total={total} 
          onChange={handlePageChange} 
          showSizeChanger={false} 
          showTotal={(total) => `共 ${total} 条`} 
        />
      </div>

      {/* 添加题目弹窗 */}
      <Modal
        title="添加新题目"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAddSubmit}>确定</Button>,
        ]}
        width={400}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item 
            label="题目" 
            name="question" 
            rules={[{ required: true, message: '请输入题目' }]}
          >
            <Input placeholder="请输入题目内容" />
          </Form.Item>
          <Form.Item 
            label="选项A" 
            name="optiona" 
            rules={[{ required: true, message: '请输入选项A' }]}
          >
            <Input placeholder="请输入选项A" />
          </Form.Item>
          <Form.Item 
            label="选项B" 
            name="optionb" 
            rules={[{ required: true, message: '请输入选项B' }]}
          >
            <Input placeholder="请输入选项B" />
          </Form.Item>
          <Form.Item label="选项C" name="optionc">
            <Input placeholder="请输入选项C（可选）" />
          </Form.Item>
          <Form.Item label="选项D" name="optiond">
            <Input placeholder="请输入选项D（可选）" />
          </Form.Item>
          <Form.Item 
            label="正确答案" 
            name="answer" 
            rules={[
              { required: true, message: '请输入正确答案' },
              { pattern: /^[a-d]$/i, message: '答案必须是a, b, c, d中的一个' }
            ]}
          >
            <Select placeholder="请选择正确答案">
              <Option value="a">A</Option>
              <Option value="b">B</Option>
              <Option value="c">C</Option>
              <Option value="d">D</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑题目弹窗 */}
      <Modal
        title={`编辑题目 #${editingQuestion?.id}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>确定</Button>,
        ]}
        width={400}
      >
        {editingQuestion && (
          <Form form={editForm} layout="vertical">
            <Form.Item 
              label="题目" 
              name="question" 
              rules={[{ required: true, message: '请输入题目' }]}
            >
              <Input placeholder="请输入题目内容" />
            </Form.Item>
            <Form.Item 
              label="选项A" 
              name="optiona" 
              rules={[{ required: true, message: '请输入选项A' }]}
            >
              <Input placeholder="请输入选项A" />
            </Form.Item>
            <Form.Item 
              label="选项B" 
              name="optionb" 
              rules={[{ required: true, message: '请输入选项B' }]}
            >
              <Input placeholder="请输入选项B" />
            </Form.Item>
            <Form.Item label="选项C" name="optionc">
              <Input placeholder="请输入选项C（可选）" />
            </Form.Item>
            <Form.Item label="选项D" name="optiond">
              <Input placeholder="请输入选项D（可选）" />
            </Form.Item>
            <Form.Item 
              label="正确答案" 
              name="answer" 
              rules={[
                { required: true, message: '请输入正确答案' },
                { pattern: /^[a-d]$/i, message: '答案必须是a, b, c, d中的一个' }
              ]}
            >
              <Select placeholder="请选择正确答案">
                <Option value="a">A</Option>
                <Option value="b">B</Option>
                <Option value="c">C</Option>
                <Option value="d">D</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

// ==================== 主应用组件 ====================
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt_token'));

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUserId');
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
