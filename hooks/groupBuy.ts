import { IGroupBuy } from "@/types/groupBuy";
import { useErrorMessage } from "@/hooks";
import { app } from "@/utils/initFirebase";
import { useState, useCallback } from "react";
import { useToast } from "@chakra-ui/toast";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  query,
  startAt,
  endAt,
  orderByChild,
  child,
  get,
} from "firebase/database";

interface ISlicedGroupBuy {
  totalPages: number;
  current_page: number;
  listData: IGroupBuy[];
}

const db = getDatabase(app);
const pathReq = "1PKYDUZiDKUUfQTYrRw0Xwk2d_I_AjuWYbnc449FEo-0/" + "groupdata/";

const convertToArray = (data: any) => {
  return data ? Object.keys(data).map((id) => ({ id: id, ...data[id] })) : [];
};

const sliceData = (params: IGroupBuy[], { limit, page }: any) => {
  const totalPages = Math.ceil(params.length / limit);
  const startSlice = page * limit - limit;
  const ascData = params.sort(function (a, b) {
    let first = new Date(a.Date).getTime();
    let last = new Date(b.Date).getTime();
    return last - first;
  });
  const slicedData = ascData.slice(startSlice, startSlice + limit);
  return {
    totalPages,
    current_page: page,
    listData: slicedData,
  };
};

export const useListGroupBuy = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const [dataGroupBuy, setDataGroupBuy] = useState<ISlicedGroupBuy>({
    totalPages: 1,
    current_page: 1,
    listData: [],
  });

  const requestData = useCallback((page: any) => {
    setLoading(true);
    const result = query(
      ref(db, pathReq),
      orderByChild("Item"),
      startAt(page.search),
      endAt(`${page.search}\uf8ff`)
    );
    onValue(result, (value) => {
      setLoading(false);
      let dataArr = convertToArray(value.val());
      let data = sliceData(dataArr, page);
      setDataGroupBuy(data);
    });
  }, []);

  const removeData = useCallback(
    (id: string) => {
      let initPath = ref(db, `${pathReq}/${id}`);
      remove(initPath)
        .then(() => {
          toast({
            title: "Data removed!",
            position: "bottom",
            isClosable: true,
            status: "success",
          });
        })
        .catch((err) => {
          // console.log("err", err)
          if (err.message) {
            toast({
              title: err.message,
              position: "bottom",
              isClosable: true,
              status: "error",
            });
          } else {
            toast({
              title: "Error remove item",
              position: "bottom",
              isClosable: true,
              status: "error",
            });
          }
        });
    },
    [toast]
  );

  return {
    isLoading,
    removeData,
    requestData,
    dataGroupBuy,
    convertToArray,
  };
};

export const getReqFirebase = () => {
  let data: any = [];
  onValue(ref(db, pathReq), (value) => {
    data = convertToArray(value.val());
  });
  return data;
};

export const getDetailReq = async (id: string) => {
  return get(child(ref(db), `${pathReq}/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    })
    .catch((error) => {
      // console.error("error get detail", error);
      useErrorMessage(error);
    });
};
