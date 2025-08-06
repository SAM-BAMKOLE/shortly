// app/routes/api/shorten.tsx
import { type ActionFunction } from "react-router";
import { getSession } from "~/lib/session";
import { strToArr } from "~/utils/helpers";
import { hardDeleteUrl, updateUrl } from "~/utils/urls";

export const action: ActionFunction = async ({ request, params }) => {
    const session = await getSession(request);
    if (!session) return { error: "Authentication required" };

    switch (request.method) {
        case "PATCH":
            try {
                const formData = await request.formData();


                const values = {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    originalUrl: formData.get("originalUrl") as string,
                    shortUrl: formData.get("shortUrl") as string,
                    status: formData.get("status") as string,
                    // creatorId: formData.get("creatorId") as string,
                    // tags: strToArr(formData.get("tags") as string),
                };

                const response = await updateUrl(String(params.urlId), values);

                if (response.error) throw new Error(response.error)
                return response;
            } catch (error: any) {
                console.log(error);
                // return { error: "Unable to update url" };
                return { error: error.message };
            }
            break;
        case "DELETE":
            try {
                const response = await hardDeleteUrl(String(params?.urlId));
                // return { message: "Url deleted successfully" };

                // return redirect("/dashboard", setFlashMessage("Url deleted successfully"));
                // return {};
            } catch (error: any) {
                return new Response(error.message, { status: 400 });
            }
    }
};
