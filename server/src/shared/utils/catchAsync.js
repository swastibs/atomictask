const catchAsync = (asyncFunction) => {
  return (request, response, next) => {
    asyncFunction(request, response, next).catch(next);
  };
};

export default catchAsync;
