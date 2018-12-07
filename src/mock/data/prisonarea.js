/**
 * nodeType 定义
 * unknown 未知 00
 * root 根节点 01
 * region 监区 02
 * sub_region 片区 03
 * area 区域 04
 * camera 摄像头 05
 * criminal 服刑人员 06
 */
const prisonarea = [{
    id: '002',
    label: '第一监区(3/1750)',
    icon: 'el-icon-date',
    isWarning: false,
    nodeType: '02',
    pri_code: '002',
    name: '第一监区',
    position: '第一监区',
    children: [{
            id: '003',
            label: '一号监舍楼(0/200)',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '003',
            name: '一号监舍楼',
            position: '一号监舍楼',
            children: [{
                    id: '004',
                    label: '一层',
                    icon: 'el-icon-news',
                    isWarning: false,
                    nodeType: '04',
                    pri_code: '004',
                    name: '一层',
                    position: '一层',
                    children: [{
                            id: '019',
                            label: '第一摄像头',
                            icon: 'el-icon-news',
                            isWarning: false,
                            nodeType: '05',
                            pri_code: 'J1JSL02L01',
                            name: '第一摄像头',
                            position: '一层',
                            angle: 45 //角度
                        },
                        {
                            id: '020',
                            label: '第二摄像头',
                            icon: 'el-icon-news',
                            isWarning: false,
                            nodeType: '05',
                            pri_code: 'J1JSL02L02',
                            name: '第二摄像头',
                            position: '一层',
                            angle: 75 //角度
                        }
                    ]
                },
                {
                    id: '005',
                    label: '二层',
                    icon: 'el-icon-news',
                    isWarning: false,
                    nodeType: '04',
                    pri_code: '005',
                    name: '二层',
                    position: '二层',
                }
            ]
        },
        {
            id: '006',
            label: '二号监舍楼',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '006',
            name: '二号监舍楼',
            position: '二号监舍楼',
        },
        {
            id: '007',
            label: '三号监舍楼',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '007',
            name: '三号监舍楼',
            position: '三号监舍楼',
        },
        {
            id: '008',
            label: '生产车间(3/125)',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '008',
            name: '生产车间',
            position: '生产车间',
            children: [{
                    id: '009',
                    label: '生产车间1(3/60)',
                    icon: 'el-icon-news',
                    isWarning: true,
                    nodeType: '04',
                    pri_code: '009',
                    name: '生产车间1',
                    position: '生产车间1',
                },
                {
                    id: '010',
                    label: '生产车间2(0/65)',
                    icon: 'el-icon-news',
                    isWarning: false,
                    nodeType: '04',
                    pri_code: '010',
                    name: '生产车间2',
                    position: '生产车间2',
                }
            ]
        },
        {
            id: '011',
            label: '教学楼',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '011',
            name: '教学楼',
            position: '教学楼',
        },
        {
            id: '012',
            label: '会见楼',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '012',
            name: '会见楼',
            position: '会见楼',
        },
        {
            id: '013',
            label: '运动场',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '013',
            name: '运动场',
            position: '运动场',
        },
        {
            id: '014',
            label: '监控室',
            icon: 'el-icon-message',
            isWarning: false,
            nodeType: '04',
            pri_code: '014',
            name: '监控室',
            position: '监控室',
        },
    ]
}, {
    id: '015',
    label: '第二监区',
    icon: 'el-icon-date',
    isWarning: false,
    nodeType: '02',
    pri_code: '015',
    name: '第二监区',
    position: '第二监区',
    children: [{
        id: '016',
        label: '一号监舍',
        icon: 'el-icon-message',
        isWarning: false,
        nodeType: '04',
        pri_code: '016',
        name: '一号监舍',
        position: '一号监舍',
    }, {
        id: '017',
        label: '二号监舍',
        icon: 'el-icon-message',
        isWarning: false,
        nodeType: '04',
        pri_code: '017',
        name: '二号监舍',
        position: '二号监舍',
    }]
}, {
    id: '018',
    label: '第三监区',
    icon: 'el-icon-date',
    isWarning: false,
    nodeType: '02',
    pri_code: '018',
    name: '第三监区',
    position: '第三监区',
    children: [{
        id: '019',
        label: '一号监舍',
        icon: 'el-icon-message',
        isWarning: false,
        nodeType: '04',
        pri_code: '019',
        name: '一号监舍',
        position: '一号监舍',
    }]
}];

export default prisonarea;