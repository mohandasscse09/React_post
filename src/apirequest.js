const apirequest = async (url = "", object = null, errMsg = null) => {
  try {
    const apiurl = await fetch(url, object);
    if (!apiurl.ok) throw Error("The data is loaded!");
  } catch (err) {
    errMsg = err.Message;
  } finally {
    return errMsg;
  }
};
export default apirequest;
