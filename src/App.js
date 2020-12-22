import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {
    Card,
    Form,
    Button,
    Select,
    TreeSelect 
} from "antd";
import _ from "lodash"

import 'antd/dist/antd.css'
import './App.css';

const layout = {
  labelCol: {
      xs: {span: 6},
      lg: {span: 7},
  },
  wrapperCol: {
      xs: {span: 18},
      lg: {span: 10},
  },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
}

const { Option } = Select

const App = () => {
  const [form] = Form.useForm();
  const [certFileList, setCertFileList] = useState([]);
  const [filterCertFileList, setFilterCertFileList] = useState([]);
  const [selectedCertFileList, setSelectedCertFileList] = useState([]);
  const [treeFileList, setTreeFileList] = useState([]);
  
  const fetchRequestsData = useCallback(async () => {
    const res = await axios({
        method: "get",
        baseURL: "http://localhost:3000",
        url: "/api/files",

    })
    if(res && res.data && res.data.success) {
      let responseData = res.data.data
      let extractedData = removeDuplicates(responseData)
      setCertFileList(responseData);
      setFilterCertFileList(extractedData);
      // console.log(extractedData)
    }
  })

  useEffect(() => {
    fetchRequestsData()
  }, [])

  const removeDuplicates = (array) => {
    // console.log(array)
    return _.uniqBy(array, 'filename')
  }

  const onFinish = async (values) => {
    console.log("form values", values)
    getTreeSelectionName(values.selectedFiles)
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = (values) => {
    // console.log("onChange", values)
    getTreeSelectionName(values)
  }

  const onFileSelect = (filename) => {
    // console.log(filename)
    let selectedlist = _.filter(certFileList, ['filename', filename])
    // console.log(selectedlist)

    var i = 0, j = 0, k = 0, m = 0;
    let d = _.chain(selectedlist)
            .groupBy("SERVER")
            .map((value, key) => {
              i++;
              let sData = _.chain(value)
                          .groupBy('DOMAIN')
                          .map((dval, dkey) => {
                            j++;
                            let domainData = _.chain(dval)
                                            .groupBy('VALCRED')
                                            .map((vcVal, vckey) => {
                                              k++;
                                              let vcData = _.chain(vcVal)
                                                          .groupBy('IDCRED')
                                                          .map((idVal, idkey) => {
                                                            m++;
                                                            return ({ id:m*1000, pId:k*100, title: idkey, value: m*1000+'--'+idkey })
                                                          })
                                                          .value()
                                              return ({ id:k*100, pId:j*10, title: vckey, value: k*100+'--'+vckey, children:vcData })
                                            })
                                            .value()
                              let domainDataNew = []
                              domainData.forEach((dd, index) => {
                                if(!!dd.title) domainDataNew.push(dd)
                                else {
                                  if(dd.children && dd.children.length>0){
                                    dd.children.forEach((c) => domainDataNew.push(c))
                                  }
                                }
                              })
                            return ({ id:j*10, pId:i, title: dkey, value: j*10+'--'+dkey, children: domainDataNew })
                          })
                          .value()
              return ({ id:i, pId: 0, title: key, value: i+'--'+key, children: sData})
            })
            .value()

    // console.log(d)
    setTreeFileList(d)
    setSelectedCertFileList(selectedlist)

  }

  const getTreeSelectionName = (values) => {
    return values.map(value => {
      let title = value.substr(value.indexOf('--')+2)
      console.log("title", title)
      return title
    })
  } 

  return (
    <Card>
      <Form
        {...layout}
        name="requestForm"
        initialValues={{
            filename: '',
            selectedFiles: []
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        form={form}
      >
        <Form.Item
          label="Files"
          name="filename"
        >
          <Select
            placeholder="Select a file"
            optionFilterProp="children"
            name={"filname"}
            onSelect={onFileSelect}
          >
            {filterCertFileList.map((file, i) => {
              return (
                <Option key={i} value={file.filename}>{file.filename}</Option>
              )
            })

            }
          </Select>
        </Form.Item>
        <Form.Item
          label="Files"
          name="selectedFiles"
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            // value={this.state.value}
            name={"selectedFiles"}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select"
            allowClear
            multiple
            treeDefaultExpandAll
            onChange={onChange}
            treeData={treeFileList}
          >
          </TreeSelect>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default App;
