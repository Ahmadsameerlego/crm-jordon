<template>
      <AdminLayout>

    <main class="flex-1 p-2 sm:p-4 lg:p-8 w-full">
        <div class="mb-6 flex justify-between items-center">
            <h2 class="text-xl font-bold">{{ $t('notifications.title') }}</h2><!---->
        </div>
        <div>
            <ul class="space-y-4">
                <li v-for="notification in notifications" :key="notification.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
                    <div>
                        <div class="font-medium dark:text-white text-gray-900 text-gray-400">
                            {{ notification.message }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">{{ notification.date }}</div>
                    </div>
                    <button @click="deleteNotification(notification.id)" class="btn-danger px-3 py-1 text-xs">{{ $t('buttons.delete') }}</button>
                </li>

            </ul>
        </div>
    </main>
    </AdminLayout>
</template>

<script setup>
import AdminLayout from "@/components/AdminLayout.vue";
import axios from "axios";
import { onMounted, ref } from "vue";

const notifications = ref([])

const getNotifications = () => {
    const fd = new FormData()
    axios.post("https://crm.be-kite.com/backend/api/show-notification",    fd ,
        {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }
    ).then((response) => {
        notifications.value = response.data.data
    });
}
onMounted(() => {
   getNotifications()
});

const deleteNotification = (id) => {
    const fd = new FormData();
    fd.append("notification_id", id);
    axios.post("https://crm.be-kite.com/backend/api/delete-notification",    fd ,
        {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        }
    ).then((response) => {
        getNotifications()
    });
}
</script>
