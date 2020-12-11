//进阶状态
const LoanStatus = {
    // 进阶初始状态
    ENTRY: 0,
    // 提交到初审
    TO_APPROVE_FIRST: 1,
    // 初审通过
    APPROVE_FIRST_PASS: 2,
    // 初审拒绝
    APPROVE_FIRST_REJECT: 3,
    // 提交到终审
    TO_APPROVE_END: 4,
    // 终审通过
    APPROVE_END_PASS: 5,
    // 终审拒绝
    APPROVE_END_REJECT: 6,
    // 生成合同
    TO_CONTRACT: 7,
    // 通过
    PASS: 'pass',
    // 拒绝
    REJECT: 'reject',

    // 私钥
    PRIVATE_KEY: 'secretOrPrivateKey',

    RESULT : {
        code: 20000,
        data:{}
    }
}

export default LoanStatus