<template>
    <div>
        <h1>Test Page</h1>
        <p>This is a test page to check middleware.</p>
        <div>do i say hello? - -- - - - -</div>
    </div>
</template>

<script lang="ts">

export default {
  middleware: 'auth',
  async asyncData() {
    const test = "hello";

    return {
        test
    };
  },
};

</script>