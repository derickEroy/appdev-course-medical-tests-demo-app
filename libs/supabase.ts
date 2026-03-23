/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function assert(env: string | undefined): asserts env is string {
  if (env === undefined) {
    throw new Error(`${env} is undefined.`);
  }
}

assert(url);
assert(key);

export const supabase = createClient(url, key);

export const useMedicalTests = () => {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("medicaltests").select(`
        id,
        name,
        normalmin,
        normalmax,
        uom:iduom (*),
        category:idcategory (*)
      `);
      setData(data ?? null);
    })();
  }, []);

  return data;
};

export const useUOM = () => {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("uom").select("*");
      setData(data ?? null);
    })();
  }, []);

  return data;
};

export const useTestCategories = () => {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("testcategories").select("*");
      setData(data ?? null);
    })();
  }, []);

  return data;
};
