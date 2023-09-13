import React from "react";
import { Provider } from "react-redux";
import ReduxToastr from "react-redux-toastr";

import store from "./redux/store/index";
import Routes from "./routes/Routes";

const App = (props) => {
  return (
    <Provider store={store}>
      <Routes />
      <ReduxToastr
        timeOut={5000}
        newestOnTop={true}
        position="bottom-right"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        showCloseButton={true}
        progressBar={true}
        progressBar
        closeOnToastrClick
      />
    </Provider>
  );
};

export default App;
