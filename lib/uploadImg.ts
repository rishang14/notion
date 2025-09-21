import { createClient } from "@supabase/supabase-js";
import { v4 } from "uuid";

const supabase = createClient(
  process.env.SUPRABASE_URL!,
  process.env.SUPRABASE_SERVICE_ROLE_kEY!
);

export const HandleUploadImg = async (imgFile: any, bucketname: string) => {
  try {
    const id = v4();
    const filename = `${bucketname}/${id}`;

    const { data, error } = await supabase.storage
      .from(bucketname)
      .upload(filename, imgFile, { cacheControl: "3600", upsert: false });

    if (error) {
      return { error: `Error : ${error.message}`, data: null };
    }

    if (data) {
      const { data: publicurldata } = supabase.storage
        .from(bucketname)
        .getPublicUrl(filename);

      return { data: publicurldata.publicUrl, error: null };
    }
  } catch (error) {
    return { error: `Error: ${error}`, data: null };
  }
};
