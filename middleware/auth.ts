import type { Context } from '@nuxt/types';

export default function ( { redirect }: Context ) {
    console.log("test");
    redirect("/chat");
}