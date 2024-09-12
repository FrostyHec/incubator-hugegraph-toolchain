import {Routes, Route} from 'react-router-dom';
import Datasource from '../pages/Datasource';
import Task from '../pages/Task';
import TaskEdit from '../pages/TaskEdit/index';
import TaskDetail from '../pages/TaskDetail';
import Schema from '../pages/Schema';
import Login from '../pages/Login';
import Graph from '../pages/Graph';
import GraphSpace from '../pages/GraphSpace';
import Meta from '../pages/Meta';
import GraphDetail from '../pages/GraphDetail';
import My from '../pages/My';
// import Super from '../pages/Super';
import Account from '../pages/Account';
import Role from '../pages/Role';
import RoleAuth from '../pages/Role/Auth';
import Resource from '../pages/Resource';
import Navigation from '../pages/Navigation';
import Error404 from '../pages/Error404';
import Test from '../pages/Test';
import Bill from '../pages/Bill';
import Order from '../pages/Order';

// 图分析的路由
import GraphAnalysis from '../pages/GraphAnalysis';
import AsyncTaskResultPage from '../pages/AsyncTaskResult';

const RouteList = ({element}) => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={element}>
                <Route index element={<Navigation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/source" element={<Datasource />} />
                <Route path="/graphspace/:graphspace/schema" element={<Schema />} />
                <Route path="/graphspace/:graphspace" element={<Graph />} />
                <Route path='/graphspace' element={<GraphSpace />} />
                <Route path='/graphspace/:graphspace/graph/:graph/meta' element={<Meta />} />
                <Route path='/graphspace/:graphspace/graph/:graph/detail' element={<GraphDetail />} />

                <Route path="/task" element={<Task />} />
                <Route path="/task/edit" element={<TaskEdit />} />
                <Route path="/task/detail/:taskid" element={<TaskDetail />} />

                <Route path='/my' element={<My />} />
                <Route path='/account' element={<Account />} />
                <Route path='/role' element={<Role />} />
                <Route path='/role/graphspace/:graphspace/:role' element={<RoleAuth />} />
                <Route path='/resource' element={<Resource />} />
                {/* <Route path="/:moduleName" element={<GraphAnalysis />} /> */}
                <Route path="/gremlin" element={<GraphAnalysis moduleName={'gremlin'} />} />
                <Route path="/algorithms" element={<GraphAnalysis moduleName={'algorithms'} />} />
                <Route path="/asyncTasks" element={<GraphAnalysis moduleName={'asyncTasks'} />} />
                {/* 从数据管理带图空间和图信息跳转到图分析平台的路由 */}
                {/* <Route path="/:moduleName/:graphSpace/:graph" element={<GraphAnalysis />} />
                <Route path="/:moduleName/:taskId" element={<GraphAnalysis />} /> */}
                <Route path="/gremlin/:graphSpace/:graph" element={<GraphAnalysis moduleName={'gremlin'} />} />
                <Route path="/gremlin/:taskId" element={<GraphAnalysis moduleName={'gremlin'} />} />
                <Route path="/algorithms/:graphSpace/:graph" element={<GraphAnalysis moduleName={'algorithms'} />} />
                <Route path="/algorithms/:taskId" element={<GraphAnalysis moduleName={'algorithms'} />} />
                <Route path="/asyncTasks/:graphSpace/:graph" element={<GraphAnalysis moduleName={'asyncTasks'} />} />
                <Route path="/asyncTasks/:taskId" element={<GraphAnalysis moduleName={'asyncTasks'} />} />
                <Route path="/asyncTasks/result/:graphspace/:graph/:taskId" element={<AsyncTaskResultPage />} />

                <Route path="/navigation" element={<Navigation />} />

                <Route path='/bill' element={<Bill />} />
                <Route path='/order' element={<Order />} />
                <Route path="*" element={<Error404 />} />
            </Route>


            <Route path="/test" element={<Test />} />
        </Routes>
    );
};

export default RouteList;