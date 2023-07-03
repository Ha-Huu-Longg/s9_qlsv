import { useEffect, useState } from 'react';
import "./App.css"
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { Button, Layout, Space, Input, Form, Pagination, Modal } from 'antd';
import FormStudent from "./FormStudent"
const { Search } = Input;

const App = () => {

    const [students, setStudents] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [studentEdit, setStudentEdit] = useState(undefined)
    const [search, setSearch] = useState("")
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalPage, setTotalPage] = useState(0)

    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    const [studentDelete, setStudentDelete] = useState(undefined)

    const getToltalPage = () => {
        fetch(`http://localhost:3000/students`)
            .then(res => res.json())
            .then(data => setTotalPage(data.length))
            .catch(error => console.log(error))
    }

    const getData = (text) => {
        let url = `http://localhost:3000/students`
        if (search !== "") {
            url += `?q=${text}`
        } else {
            url += `?_start=${(currentPage - 1) * pageSize}&_end=${currentPage * pageSize}`
        }
        fetch(url)
            .then(res => res.json())
            .then(data => setStudents(data))
            .then(() => getToltalPage())
            .catch(error => console.log(error))
    }

    const handleDelete = () => {
        fetch(`http://localhost:3000/students/${studentDelete.id}`, {
            method: "DELETE"
        })
            .then(() => {
                setIsOpenModalDelete(false)
                setStudentDelete(undefined)
            })
            .then(() => getData())
            .catch(error => console.log(error))
    }

    const handleEdit = (student) => {
        setStudentEdit(student)
        setIsOpen(true)
    }

    const onCancel = () => {
        setIsOpen(false)
        setIsOpenModalDelete(false)
        setStudentEdit(undefined)
        setStudentDelete(undefined)
    }

    const onFinish = async (value) => {
        let url = `http://localhost:3000/students`
        let method = ""

        if (studentEdit === undefined) {
            method = "POST"
        } else {
            method = "PUT"
            url += `/${studentEdit.id}`
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        })
            .then(() => {
                form.resetFields()
                setIsOpen(false)
                setStudentEdit(undefined)
                setStudentDelete(undefined)
                getData()
            })
            .catch(error => console.log(error))
    }

    const onSearch = () => {
        getData(search)
    }

    useEffect(() => {
        getData()
    }, [currentPage, pageSize])

    return (
        <div className='container'>

            {isOpen && <FormStudent isOpen={isOpen} onCancel={onCancel} onFinish={onFinish} form={form} studentEdit={studentEdit} />}

            {isOpenModalDelete && <Modal title="Student" open={isOpenModalDelete} onCancel={onCancel} maskClosable={false} onOk={handleDelete}>Bạn chắc chứ ?</Modal>}

            <Space
                direction="vertical"
                style={{ width: '100%' }}
                size={[0, 48]}
            >
                <Layout>
                    <Header>
                        <h4 className='title'>Student Management</h4>
                    </Header>
                    <Content>
                        <Space className='content-space'>
                            <Button onClick={() => setIsOpen(true)}>Add student</Button>
                            <Search placeholder="Search" enterButton value={search} onChange={e => setSearch(e.target.value)} onSearch={onSearch} />
                        </Space>
                        <Space className='container-table' >
                            <table style={{ textAlign: "center" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: 200 }}>Name</th>
                                        <th style={{ width: 50 }}>Age</th>
                                        <th style={{ width: 200 }}>Address</th>
                                        <th style={{ width: 100 }}>Phone</th>
                                        <th style={{ width: 200 }}>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.name}</td>
                                            <td>{student.age}</td>
                                            <td>{student.address}</td>
                                            <td>{student.phone}</td>
                                            <td>{student.email}</td>
                                            <td className='btn-action'>
                                                <Button onClick={() => handleEdit(student)}>Edit</Button>
                                                <Button danger onClick={() => { setIsOpenModalDelete(true); setStudentDelete(student) }}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!search && <Pagination
                                total={totalPage}
                                current={currentPage}
                                onChange={(page, pageSize) => setCurrentPage(page)}
                                pageSizeOptions={[10, 20, 30, 40, 50]}
                                showSizeChanger={true}
                                onShowSizeChange={(current, size) => setPageSize(size)}
                            />}
                        </Space>
                    </Content>
                    <Footer className='t-center'>Made with ❤ by Ant Group and Ant Design Community</Footer>
                </Layout>
            </Space>
        </div>
    );
};
export default App;