<template>
  <!-- 注册 -->
  <el-form @validate="console.clear()" v-loading="isLoading" :element-loading-text="loadingText" label-position="top"
    hide-required-asterisk :rules="rules" :model="formUser" @submit.prevent="onRegister(registerType)"
    class="form animate__animated ">
    <h2 mb-5 tracking-0.2em>开启你的专属圈子</h2>
    <p mb-10 tracking-0.1em text-0.8em>
      已有账户？
      <span color-emerald cursor-pointer hover:font-700 transition-300 @click="toLoginForm">立即登录
      </span>
    </p>
    <!-- 切换注册 -->
    <div class="toggle-login" my-1em>
      <el-button flex-1 :class="{ active: registerType === RegisterType.PHONE }"
        @click="registerType = RegisterType.PHONE" tracking-0.1em>手机注册</el-button>
      <el-button flex-1 :class="{ active: registerType === RegisterType.EMAIL }"
        @click="registerType = RegisterType.EMAIL" tracking-0.1em>邮箱注册</el-button>
    </div>
    <!-- 验证码注册(客户端 ) -->
    <!-- 用户名 -->
    <el-form-item label="" prop="username" class="animated">
      <el-input prefix-icon="user" v-model.lazy="formUser.username" size="large" placeholder="请输入用户名" />
    </el-form-item>
    <!-- 邮箱 -->
    <el-form-item v-if="registerType === RegisterType.EMAIL" prop="email" class="animated">
      <el-input type="email" prefix-icon="Message" v-model.trim="formUser.email" size="large" placeholder="请输入邮箱">
        <template #append>
          <el-button type="primary" @click="getLoginCode(registerType)" :disabled="emailCodeStorage > 0">{{
            emailCodeStorage > 0 ? `${emailCodeStorage}s后重新发送` : '获取验证码' }}</el-button>
        </template>
      </el-input>
    </el-form-item>
    <!-- 手机号 -->
    <el-form-item v-if="registerType === RegisterType.PHONE" type="tel" prop="phone" class="animated">
      <el-input prefix-icon="Iphone" v-model.trim="formUser.phone" size="large" placeholder="请输入手机号">
        <template #append>
          <el-button type="primary" @click="getLoginCode(registerType)" :disabled="phoneCodeStorage > 0">{{
            phoneCodeStorage > 0 ? `${phoneCodeStorage}s后重新发送` : '获取验证码'
          }}</el-button>
        </template>
      </el-input>
    </el-form-item>
    <!-- 验证码 -->
    <el-form-item prop="code" class="animated">
      <el-input prefix-icon="ChatDotSquare" v-model.trim="formUser.code" size="large" placeholder="请输入验证码" />
    </el-form-item>
    <!-- 密 码 -->
    <el-form-item type="password" label="" prop="password" class="animated">
      <el-input prefix-icon="Lock" v-model.trim="formUser.password" size="large" placeholder="请输入密码（6-20位）"
        type="password" />
    </el-form-item>
    <el-form-item mt-1em>
      <el-input type="submit" flex-1 size="large" class="submit">
        注 册
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import { FormRules } from 'element-plus';
import { toRegister, DeviceType, getRegisterCode, toLoginByPwd } from '~/composables/api/user';
import { checkUsernameExists } from '~/composables/api/user/info';
import { Result } from '~/types/result';
import { RegisterType } from '~/types/user/index.js';


// 注册方式
const registerType = ref<number>(RegisterType.PHONE);
// 请求加载
const isLoading = ref<boolean>(false);
const loadingText = ref<string>("")
// 表单
const formUser = reactive({
  username: '',// 用户名
  phone: "",// 手机号 0
  email: "", // 邮箱 1
  code: '',// 验证码
  password: '',// 密码
});
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空！', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,}$/, message: '英文开头、字母数字下划线组成', trigger: 'change' },
    { min: 6, max: 30, message: '长度在6-30个字符！', trigger: 'change' },
    {
      asyncValidator: async (rule, value) => {
        return await checkUsername();
      }, message: '该用户名已被使用！', trigger: 'change'
    },
  ],
  password: [
    { required: true, message: '密码不能为空！', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度为6-20！', trigger: 'change' },
  ],
  code: [{
    required: true, message: "验证码6位组成！", trigger: 'change',
  },
  ],
  email: [
    { required: true, message: '邮箱不能为空！', trigger: 'blur' },
    { pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, message: '邮箱格式不正确！', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '手机号不能为空！', trigger: 'blur' },
    { pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/, message: '手机号格式不正确！', trigger: 'change' },
  ],
});


// 验证码有效期
const phoneTimer = ref(-1)
const emailTimer = ref(-1)
const emailCodeStorage = ref<number>(0)
const phoneCodeStorage = ref<number>(0)
/**
* 获取验证码
* @param type 
*/
const getLoginCode = async (type: RegisterType) => {
  let data;
  // 获取邮箱验证码
  if (type === RegisterType.EMAIL) {
    // 简单校验
    if (formUser.email.trim() === "") return;
    if (!checkEmail(formUser.email)) {
      return ElMessage.error("邮箱格式不正确！")
    }
    isLoading.value = true;

    // 请求验证码
    data = await getRegisterCode(formUser.email, DeviceType.EMAIL);
    // 成功
    if (data.code === 20000) {
      ElMessage.success({
        message: '验证码已发送至您的邮箱，5分钟有效！',
        duration: 5000,
      })
      useInterval(emailTimer, emailCodeStorage, 60, -1)
    }
  }
  // 获取手机号验证码
  else if (type === RegisterType.PHONE) {
    if (formUser.phone.trim() === "") return;
    if (!checkPhone(formUser.phone)) {
      return ElMessage.error("手机号格式不正确！")
    }
    isLoading.value = true;
    data = await getRegisterCode(formUser.phone, DeviceType.PHONE);
    if (data.code === 20000) {
      // 开启定时器
      formUser.code = data.data
      useInterval(phoneTimer, phoneCodeStorage, 60, -1)
      ElMessage.success({
        message: `手机验证码为：${data.data}`,
        duration: 5000,
      })
    }
  }
  // 关闭加载
  isLoading.value = false;
}
/**
* 
* @param timer 本地定时器
* @param num 计数对象
* @param target 开始秒数
* @param step 自增自减
* @param fn 回调
*/
const useInterval = (timer: any, num: Ref<number>, target?: number, step: number = -1, fn?: Function) => {
  num.value = target || timer.value
  timer.value = setInterval(() => {
    num.value += step
    // 清除定时器
    if (num.value <= 0) {
      num.value = -1
      timer.value = -1
      clearInterval(timer.value)
    }
  }, 1000)
};
const store = useUserStore()
/**
* 注册
* @param type 注册类型
*/
const onRegister = async (type: RegisterType) => {
  let data: Result<string>;
  switch (type) {
    case RegisterType.PHONE:
      data = await toRegister({
        username: formUser.username,
        phone: formUser.phone,
        password: formUser.password,
        code: formUser.code,
        type: type
      })
      break;
    case RegisterType.EMAIL:
      data = await toRegister({
        username: formUser.username,
        password: formUser.password,
        code: formUser.code,
        email: formUser.email,
        type: type
      })
      break;
  }

  if (data.code === 20000) {
    // 注册成功
    if (data.data != "") {
      ElMessage.success({
        message: "恭喜，注册成功 🎉",
        duration: 3000,
      })
      // 登录
      let count = 3
      let timers = setInterval(() => {
        isLoading.value = true
        loadingText.value = `${count}s后自动登录...`
        if (count <= 0) {
          (async () => {
            const data = await toLoginByPwd(formUser.username, formUser.password)
            // 自动登录成功
            store.$patch({
              token: data.data,
              showLoginForm: false,
              showRegisterForm: false,
              isLogin: true,
            });
            ElMessage.success({
              message: "登录成功！",
            })
            store.onUserLogin(data.data)
            isLoading.value = false
            // 清除
            clearInterval(timers)
          })()
        }
        count--
      }, 1000)
    }
    // 注册失败
    else {
      ElMessage.error({
        message: data.message || "抱歉，注册出了点问题！",
        duration: 4000,
      })
      // store
      store.$patch({
        token: "",
        isLogin: false,
      });
    }
  }
}
/**
 * 验证是否存在该用户
 */
const checkUsername = async () => {
  if (formUser.username.trim() === "") return Promise.reject()
  let data = await checkUsernameExists(formUser.username);
  if (data.code === 20000) {
    return Promise.resolve();
  }
  return Promise.reject("该用户名已被使用！");
}

const toLoginForm = () => {
  store.$patch({
    showRegisterForm: false,
    showLoginForm: true,
  })
}
</script>



<style scoped lang="scss">
.form {
  width: 400px;
  display: inline-block;
  padding: 2.5em 3em 2em 3em;
  background-color: #ffffff;
  border-radius: var(--el-border-radius-base);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(109, 109, 109, 0.2);
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
  overflow: hidden;
  animation-duration: 1s;

  :deep(.el-input__wrapper) {
    padding: 0.3em 1em;

  }

  // 报错信息 
  :deep(.el-form-item) {
    padding: 0.2em;

    .el-form-item__error {
      padding-top: 0.2em;
    }
  }
}

:deep(.el-button) {
  padding: 0.3em 1em;
}

.dark .form {
  background-color: #161616d8;
}

// label总体
:deep(.el-form-item) {
  margin-bottom: 14px;
}

// 切换注册
.toggle-login {
  position: relative;
  border-radius: var(--el-border-radius-base);
  backdrop-filter: blur(10px);
  background-color: #dddddd2a;
  padding: 0.3em;
  display: flex;

  :deep(.el-button) {
    background-color: transparent;
    transition: 0.3s;
    padding: 0em 0.6em;
    border: none;
  }

  .active {
    transition: 0.3s;
    background-color: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 4px;
    background-color: transparent;
    color: var(--el-text-color);
  }

}

.dark .active {
  background-color: var(--el-color-primary);
}

.submit {
  font-size: 1.2em;
  font-weight: 800;
  transition: 0.3s;
  cursor: pointer;

  :deep(.el-input__wrapper) {
    background-color: var(--el-color-primary);
    cursor: pointer;

    * {
      color: #fff;
      font-weight: 800;
      letter-spacing: 0.4em;
    }
  }


  .dark:deep(.el-input__wrapper) {
    background-color: var(--el-color-primary);
    cursor: pointer;
    color: #fff;
  }
}
</style>
